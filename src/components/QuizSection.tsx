import { useState, useCallback, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, Brain, RefreshCw, ChevronRight, Award, AlertTriangle, Sparkles, AlertCircle } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useAuthBloc } from '../blocs/authBloc'
import { 
  generateQuiz, 
  calculateQuizResult, 
  checkAnswer,
  getQuestionTypeName,
  QuizQuestion, 
  QuizResult, 
  QuizHistory
} from '../services/aiService'
import { saveQuizHistory, loadQuizHistory } from '../services/supabaseService'

interface QuizSectionProps {
  lessonId: string           // 课程 ID，用于保存历史
  lessonTitle: string
  lessonContent: string
  onComplete?: (score: number) => void
}

/**
 * AI 小测验内嵌组件
 * 支持多种题型、错题重测、动态题目数量
 * 测验历史保存到 Supabase（用户登录后）
 */
export function QuizSection({ lessonId, lessonTitle, lessonContent, onComplete }: QuizSectionProps) {
  const theme = useThemeBloc((state) => state.theme)
  const { currentUser } = useAuthBloc()
  const isDark = theme === 'dark'

  // 状态管理
  const [status, setStatus] = useState<'idle' | 'loading' | 'quiz' | 'result' | 'error'>('idle')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | number[] | string)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string>('')
  
  // 测验历史记录（保存错题和已出过的题）
  const [quizHistory, setQuizHistory] = useState<QuizHistory | null>(null)
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false)

  // 从云端加载历史记录（纯云端版本）
  const loadHistory = useCallback(async (): Promise<QuizHistory | null> => {
    try {
      // 用户必须登录才能使用测验功能
      if (!currentUser) {
        console.warn('用户未登录，无法加载测验历史')
        return null
      }
      
      // 从 Supabase 加载
      const cloudHistory = await loadQuizHistory(currentUser.id, lessonId)
      return cloudHistory
    } catch (e) {
      console.error('加载测验历史失败:', e)
      return null
    }
  }, [lessonId, currentUser])

  // 保存历史记录到云端（纯云端版本）
  const saveHistory = useCallback(async (history: QuizHistory) => {
    try {
      // 用户必须登录才能保存
      if (!currentUser) {
        console.warn('用户未登录，无法保存测验历史')
        return
      }
      
      // 保存到 Supabase
      await saveQuizHistory(currentUser.id, lessonId, history)
    } catch (e) {
      console.error('保存测验历史失败:', e)
    }
  }, [lessonId, currentUser])

  // 组件加载时，预加载历史记录
  useEffect(() => {
    if (!isHistoryLoaded) {
      loadHistory().then(history => {
        if (history) {
          setQuizHistory(history)
        }
        setIsHistoryLoaded(true)
      })
    }
  }, [loadHistory, isHistoryLoaded])

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

  // 当前题目
  const currentQuestion = questions[currentIndex]
  
  // 检查当前答案是否正确
  const isCurrentAnswerCorrect = currentQuestion && userAnswers[currentIndex] !== undefined
    ? checkAnswer(currentQuestion, userAnswers[currentIndex])
    : false

  // 渲染选项（单选/判断）
  const renderSingleChoiceOptions = () => {
    if (!currentQuestion) return null
    
    return (
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === currentQuestion.correctIndex
          const showCorrect = showExplanation && isCorrect
          const showWrong = showExplanation && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => handleSelectSingle(index)}
              disabled={showExplanation}
              className={`
                w-full text-left p-4 rounded-3xl transition-all duration-200 cursor-pointer
                ${showCorrect 
                  ? 'bg-accent-green/15 shadow-[inset_0_0_0_2px_rgba(61,214,140,0.5)]' 
                  : showWrong 
                    ? 'bg-red-500/15 shadow-[inset_0_0_0_2px_rgba(239,68,68,0.5)]' 
                    : isSelected 
                      ? isDark 
                        ? 'bg-accent-blue/15 shadow-[inset_0_0_0_2px_rgba(77,159,255,0.5)]' 
                        : 'bg-accent-blue/10 ring-2 ring-accent-blue/50'
                      : isDark 
                        ? 'bg-zinc-800/50 hover:bg-zinc-800' 
                        : 'bg-gray-50 hover:bg-gray-100'
                }
                ${showExplanation ? 'cursor-default' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0
                  ${showCorrect 
                    ? 'bg-accent-green text-black' 
                    : showWrong 
                      ? 'bg-red-500 text-white' 
                      : isSelected 
                        ? 'bg-accent-blue text-white' 
                        : isDark 
                          ? 'bg-zinc-700 text-zinc-300' 
                          : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {showCorrect ? <CheckCircle size={16} /> : showWrong ? <XCircle size={16} /> : String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // 渲染多选选项
  const renderMultipleChoiceOptions = () => {
    if (!currentQuestion) return null
    const selectedIndices = (selectedAnswer as number[]) || []
    const correctIndices = currentQuestion.correctIndex as number[]
    
    return (
      <div className="space-y-3 mb-6">
        <p className={`text-sm mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          （可多选，请选择所有正确答案）
        </p>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedIndices.includes(index)
          const isCorrect = correctIndices.includes(index)
          const showCorrect = showExplanation && isCorrect
          const showWrong = showExplanation && isSelected && !isCorrect
          const showMissed = showExplanation && isCorrect && !isSelected

          return (
            <button
              key={index}
              onClick={() => handleSelectMultiple(index)}
              disabled={showExplanation}
              className={`
                w-full text-left p-4 rounded-3xl transition-all duration-200 cursor-pointer
                ${showCorrect || showMissed
                  ? 'bg-accent-green/15 shadow-[inset_0_0_0_2px_rgba(61,214,140,0.5)]' 
                  : showWrong 
                    ? 'bg-red-500/15 shadow-[inset_0_0_0_2px_rgba(239,68,68,0.5)]' 
                    : isSelected 
                      ? isDark 
                        ? 'bg-accent-blue/15 shadow-[inset_0_0_0_2px_rgba(77,159,255,0.5)]' 
                        : 'bg-accent-blue/10 ring-2 ring-accent-blue/50'
                      : isDark 
                        ? 'bg-zinc-800/50 hover:bg-zinc-800' 
                        : 'bg-gray-50 hover:bg-gray-100'
                }
                ${showExplanation ? 'cursor-default' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0
                  ${showCorrect || showMissed
                    ? 'bg-accent-green text-black' 
                    : showWrong 
                      ? 'bg-red-500 text-white' 
                      : isSelected 
                        ? 'bg-accent-blue text-white' 
                        : isDark 
                          ? 'bg-zinc-700 text-zinc-300' 
                          : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {(showCorrect || showMissed) ? <CheckCircle size={16} /> : showWrong ? <XCircle size={16} /> : String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showMissed && !isSelected && (
                  <span className="text-xs text-accent-green">漏选</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // 渲染填空题
  const renderFillBlankInput = () => {
    if (!currentQuestion) return null
    const userInput = (selectedAnswer as string) || ''
    const isCorrect = showExplanation && checkAnswer(currentQuestion, userInput)
    
    return (
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => handleInputAnswer(e.target.value)}
            disabled={showExplanation}
            placeholder="请输入答案"
            className={`
              w-full px-4 py-3 rounded-full text-base transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-blue/30
              ${showExplanation
                ? isCorrect
                  ? 'bg-accent-green/15 shadow-[inset_0_0_0_2px_rgba(61,214,140,0.5)]'
                  : 'bg-red-500/15 shadow-[inset_0_0_0_2px_rgba(239,68,68,0.5)]'
                : isDark 
                  ? 'bg-zinc-800/50 text-white placeholder:text-zinc-500' 
                  : 'bg-gray-50 text-gray-900 placeholder:text-gray-400'
              }
            `}
          />
          {showExplanation && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle size={20} className="text-accent-green" />
              ) : (
                <XCircle size={20} className="text-red-500" />
              )}
            </div>
          )}
        </div>
        {showExplanation && !isCorrect && (
          <p className="mt-2 text-sm text-accent-green">
            正确答案：{currentQuestion.correctAnswer}
          </p>
        )}
      </div>
    )
  }

  // 渲染题目内容
  const renderQuestionContent = () => {
    if (!currentQuestion) return null
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return renderMultipleChoiceOptions()
      case 'fill_blank':
        return renderFillBlankInput()
      case 'single_choice':
      case 'true_false':
      default:
        return renderSingleChoiceOptions()
    }
  }

  // 检查是否可以提交答案
  const canSubmitAnswer = () => {
    if (selectedAnswer === null) return false
    if (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) return false
    if (typeof selectedAnswer === 'string' && selectedAnswer.trim() === '') return false
    return true
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
      <div className={`
        px-6 py-4 flex items-center justify-between
        ${isDark ? 'bg-[#1a1a1e] border-b border-zinc-800/50' : 'bg-gray-50 border-b border-gray-100'}
      `}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              AI 小测验
              <span className={`
                text-xs px-2 py-0.5 rounded-full
                ${isDark ? 'bg-accent-blue/15 text-accent-blue' : 'bg-accent-blue/10 text-accent-blue'}
              `}>
                智能出题
              </span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
              多题型 · 错题重测 · 知识点全覆盖
            </p>
          </div>
        </div>
        {status === 'quiz' && currentQuestion && (
          <div className="flex items-center gap-3">
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}
            `}>
              {getQuestionTypeName(currentQuestion.type)}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 初始状态 - 显示开始按钮 */}
        {status === 'idle' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/10 mb-4">
              <Sparkles className="w-8 h-8 text-accent-blue" />
            </div>
            <h4 className="text-lg font-medium mb-2">准备好检验学习成果了吗？</h4>
            <p className={`text-sm mb-6 max-w-md mx-auto ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              AI 将根据本课「{lessonTitle}」的内容智能生成测验题目，
              包含单选、多选、判断、填空等多种题型
            </p>
            <button
              onClick={() => startQuiz(false)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
            >
              <Brain size={18} />
              开始测验
            </button>
          </div>
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
          <div>
            {/* 进度条 */}
            <div className={`h-1.5 rounded-full mb-8 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
              <div 
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-green transition-all duration-300"
                style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>

            {/* 题目 */}
            <h4 className="text-lg font-medium mb-6">{currentQuestion.question}</h4>

            {/* 渲染题目选项/输入框 */}
            {renderQuestionContent()}

            {/* 答案解析 */}
            {showExplanation && (
              <div className={`
                p-4 rounded-3xl mb-6
                ${isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}
              `}>
                <div className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${isCurrentAnswerCorrect
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'bg-red-500/20 text-red-500'
                    }
                  `}>
                    {isCurrentAnswerCorrect 
                      ? <CheckCircle size={14} /> 
                      : <XCircle size={14} />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      isCurrentAnswerCorrect 
                        ? 'text-accent-green' 
                        : 'text-red-500'
                    }`}>
                      {isCurrentAnswerCorrect ? '回答正确！' : '回答错误'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end">
              {!showExplanation ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!canSubmitAnswer()}
                  className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200
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
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      下一题
                      <ChevronRight size={18} />
                    </>
                  ) : (
                    '查看结果'
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 测验结果 */}
        {status === 'result' && result && (
          <div className="text-center py-8">
            {/* 成绩图标 */}
            <div className={`
              inline-flex items-center justify-center w-20 h-20 rounded-full mb-6
              ${result.score >= 80 
                ? 'bg-accent-green/15' 
                : result.score >= 60 
                  ? 'bg-accent-orange/15' 
                  : 'bg-red-500/15'
              }
            `}>
              <Award className={`
                w-10 h-10
                ${result.score >= 80 
                  ? 'text-accent-green' 
                  : result.score >= 60 
                    ? 'text-accent-orange' 
                    : 'text-red-500'
                }
              `} />
            </div>

            {/* 分数 */}
            <div className="mb-2">
              <span className={`
                text-5xl font-bold
                ${result.score >= 80 
                  ? 'text-accent-green' 
                  : result.score >= 60 
                    ? 'text-accent-orange' 
                    : 'text-red-500'
                }
              `}>
                {result.score}
              </span>
              <span className={`text-2xl ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>分</span>
            </div>

            {/* 正确率 */}
            <p className={`text-sm mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              答对 {result.correctCount} / {result.totalQuestions} 题
            </p>

            {/* 反馈 */}
            <p className={`text-base mb-6 max-w-md mx-auto ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              {result.feedback}
            </p>

            {/* 错题提示 */}
            {result.wrongQuestions.length > 0 && result.score < 100 && (
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
                ${isDark ? 'bg-accent-orange/10 text-accent-orange' : 'bg-accent-orange/10 text-accent-orange'}
              `}>
                <AlertCircle size={16} />
                <span className="text-sm">
                  再测一次将针对 {result.wrongQuestions.length} 道错题重新出题
                </span>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {result.score < 100 && (
                <button
                  onClick={() => startQuiz(true)}
                  className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer
                    ${isDark 
                      ? 'bg-accent-orange/15 text-accent-orange hover:bg-accent-orange/25' 
                      : 'bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20'
                    }
                  `}
                >
                  <RefreshCw size={18} />
                  针对错题再测
                </button>
              )}
              <button
                onClick={() => startQuiz(false)}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer
                  ${isDark 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <Sparkles size={18} />
                全新题目
              </button>
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-green text-black font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
              >
                <CheckCircle size={18} />
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
