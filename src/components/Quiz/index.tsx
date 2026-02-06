/**
 * AI 小测验主组件
 * 支持多种题型、错题重测、动态题目数量
 * 测验历史保存到 Supabase（用户登录后）
 */

import { useState } from 'react'
import { Loader2, Brain, RefreshCw, AlertTriangle } from 'lucide-react'
import { useThemeBloc } from '../../blocs/themeBloc'
import { 
  generateQuiz, 
  calculateQuizResult, 
  QuizQuestion, 
  QuizResult, 
  QuizHistory
} from '../../services/aiService'
import { useQuizHistory } from './hooks/useQuizHistory'
import { QuizHeader } from './QuizHeader'
import { QuizIdle } from './QuizIdle'
import { QuizQuestionComponent } from './QuizQuestion'
import { QuizResultComponent } from './QuizResult'

interface QuizSectionProps {
  lessonId: string           // 课程 ID，用于保存历史
  lessonTitle: string
  lessonContent: string
  onComplete?: (score: number) => void
}

export function QuizSection({ lessonId, lessonTitle, lessonContent, onComplete }: QuizSectionProps) {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 使用 Hook 管理测验历史
  const {
    quizHistory,
    setQuizHistory,
    isHistoryLoaded,
    setIsHistoryLoaded,
    loadHistory,
    saveHistory
  } = useQuizHistory(lessonId)

  // 状态管理
  const [status, setStatus] = useState<'idle' | 'loading' | 'quiz' | 'result' | 'error'>('idle')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | number[] | string)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string>('')

  // 开始测验
  const startQuiz = async (isRetry: boolean = false) => {
    setStatus('loading')
    setError('')
    setCurrentIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setResult(null)

    try {
      // 加载历史记录（如果还没加载）
      let history = quizHistory
      if (!isHistoryLoaded) {
        history = await loadHistory()
        setIsHistoryLoaded(true)
      }
      
      // 如果是重测且有错题，传递历史记录
      const historyToUse = isRetry && history && history.wrongQuestions.length > 0 
        ? history 
        : history ? new QuizHistory(lessonId, history.questions, [], history.attemptCount) : null
      
      // 生成题目
      const quizQuestions = await generateQuiz(lessonTitle, lessonContent, historyToUse || undefined)
      setQuestions(quizQuestions)
      
      // 更新历史记录
      const newHistory = new QuizHistory(
        lessonId,
        [...(history?.questions || []), ...quizQuestions],
        [], // 清空错题，等本次测验结束后再记录
        (history?.attemptCount || 0) + 1
      )
      setQuizHistory(newHistory)
      
      setStatus('quiz')
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成测验失败，请稍后重试')
      setStatus('error')
    }
  }

  // 选择答案（单选/判断）
  const handleSelectSingle = (index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }

  // 选择答案（多选）
  const handleSelectMultiple = (index: number) => {
    if (showExplanation) return
    const current = (selectedAnswer as number[]) || []
    if (current.includes(index)) {
      setSelectedAnswer(current.filter(i => i !== index))
    } else {
      setSelectedAnswer([...current, index])
    }
  }

  // 输入答案（填空）
  const handleInputAnswer = (value: string) => {
    if (showExplanation) return
    setSelectedAnswer(value)
  }

  // 确认答案
  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || 
        (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) ||
        (typeof selectedAnswer === 'string' && selectedAnswer.trim() === '')) {
      return
    }
    setShowExplanation(true)
    setUserAnswers([...userAnswers, selectedAnswer])
  }

  // 下一题
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      // 根据下一题类型初始化选择状态
      const nextQuestion = questions[currentIndex + 1]
      if (nextQuestion.type === 'multiple_choice') {
        setSelectedAnswer([])
      } else if (nextQuestion.type === 'fill_blank') {
        setSelectedAnswer('')
      } else {
        setSelectedAnswer(null)
      }
      setShowExplanation(false)
    } else {
      // 计算结果
      const finalAnswers = [...userAnswers]
      const quizResult = calculateQuizResult(questions, finalAnswers)
      setResult(quizResult)
      
      // 保存错题到历史记录
      if (quizHistory) {
        const updatedHistory = new QuizHistory(
          quizHistory.lessonId,
          quizHistory.questions,
          quizResult.wrongQuestions,
          quizHistory.attemptCount
        )
        setQuizHistory(updatedHistory)
        saveHistory(updatedHistory)
      }
      
      setStatus('result')
      onComplete?.(quizResult.score)
    }
  }

  // 重新生成当前题目（替换有问题的题目）
  const handleRegenerateQuestion = (newQuestion: QuizQuestion) => {
    setQuestions(prev => {
      const updated = [...prev]
      updated[currentIndex] = newQuestion
      return updated
    })
    // 重置当前题目状态
    setShowExplanation(false)
    if (newQuestion.type === 'multiple_choice') {
      setSelectedAnswer([])
    } else if (newQuestion.type === 'fill_blank') {
      setSelectedAnswer('')
    } else {
      setSelectedAnswer(null)
    }
  }

  // 重置测验
  const resetQuiz = () => {
    setStatus('idle')
    setQuestions([])
    setCurrentIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setResult(null)
  }

  // 检查是否可以提交答案
  const canSubmitAnswer = () => {
    if (selectedAnswer === null) return false
    if (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) return false
    if (typeof selectedAnswer === 'string' && selectedAnswer.trim() === '') return false
    return true
  }

  // 当前题目
  const currentQuestion = questions[currentIndex]

  // 渲染操作按钮（PC端显示在header）
  const renderActionButton = () => {
    if (status !== 'quiz') return null
    
    if (!showExplanation) {
      return (
        <button
          onClick={handleConfirmAnswer}
          disabled={!canSubmitAnswer()}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            ${canSubmitAnswer()
              ? 'bg-accent-blue text-white cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20' 
              : isDark 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          确认答案
        </button>
      )
    } else {
      return (
        <button
          onClick={handleNextQuestion}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
        >
          {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
        </button>
      )
    }
  }

  return (
    <section className={`
      mt-12 rounded-3xl overflow-hidden
      ${isDark 
        ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]' 
        : 'bg-white border border-light-border-DEFAULT shadow-sm'
      }
    `}>
      {/* 头部 */}
      <QuizHeader
        status={status}
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        isDark={isDark}
        actionButton={renderActionButton()}
      />

      {/* 内容区域 */}
      <div className="p-6">
        {/* 初始状态 */}
        {status === 'idle' && (
          <QuizIdle
            lessonTitle={lessonTitle}
            quizHistory={quizHistory}
            isDark={isDark}
            onStart={startQuiz}
          />
        )}

        {/* 加载状态 */}
        {status === 'loading' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/15 mb-6">
              <Brain className="w-8 h-8 text-accent-blue animate-pulse" />
            </div>
            <h4 className="text-lg font-medium mb-2">AI 正在智能出题...</h4>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              分析课程内容，生成多样化题目
            </p>
            <Loader2 className="w-6 h-6 mx-auto mt-6 animate-spin text-accent-blue" />
          </div>
        )}

        {/* 错误状态 */}
        {status === 'error' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/15 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-lg font-medium mb-2">生成失败</h4>
            <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {error}
            </p>
            <button
              onClick={() => startQuiz(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
            >
              <RefreshCw size={18} />
              重试
            </button>
          </div>
        )}

        {/* 测验题目 */}
        {status === 'quiz' && currentQuestion && (
          <QuizQuestionComponent
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            userAnswer={userAnswers[currentIndex]}
            isDark={isDark}
            lessonTitle={lessonTitle}
            lessonContent={lessonContent}
            onSelectSingle={handleSelectSingle}
            onSelectMultiple={handleSelectMultiple}
            onInputAnswer={handleInputAnswer}
            onConfirm={handleConfirmAnswer}
            onNext={handleNextQuestion}
            onRegenerate={handleRegenerateQuestion}
            canSubmit={canSubmitAnswer()}
          />
        )}

        {/* 测验结果 */}
        {status === 'result' && result && (
          <QuizResultComponent
            result={result}
            isDark={isDark}
            onRetry={() => startQuiz(true)}
            onNewQuiz={() => startQuiz(false)}
            onComplete={resetQuiz}
          />
        )}
      </div>
    </section>
  )
}
