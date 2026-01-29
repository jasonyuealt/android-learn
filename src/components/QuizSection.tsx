import { useState } from 'react'
import { CheckCircle, XCircle, Loader2, Brain, RefreshCw, ChevronRight, Award, AlertTriangle, Sparkles } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { generateQuiz, calculateQuizResult, QuizQuestion, QuizResult } from '../services/aiService'

interface QuizSectionProps {
  lessonTitle: string
  lessonContent: string
  onComplete?: (score: number) => void
}

/**
 * AI 小测验内嵌组件
 * 直接在课程页面内显示，无需弹窗
 */
export function QuizSection({ lessonTitle, lessonContent, onComplete }: QuizSectionProps) {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 状态管理
  const [status, setStatus] = useState<'idle' | 'loading' | 'quiz' | 'result' | 'error'>('idle')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string>('')

  // 开始测验
  const startQuiz = async () => {
    setStatus('loading')
    setError('')
    setCurrentIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setResult(null)

    try {
      const quizQuestions = await generateQuiz(lessonTitle, lessonContent, 3)
      setQuestions(quizQuestions)
      setStatus('quiz')
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成测验失败，请稍后重试')
      setStatus('error')
    }
  }

  // 选择答案
  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }

  // 确认答案
  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return
    setShowExplanation(true)
    setUserAnswers([...userAnswers, selectedAnswer])
  }

  // 下一题
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // 计算结果
      const quizResult = calculateQuizResult(questions, [...userAnswers])
      setResult(quizResult)
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

  const currentQuestion = questions[currentIndex]

  return (
    <section className={`
      mt-12 rounded-2xl overflow-hidden
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
                实时生成
              </span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
              检验本课学习成果
            </p>
          </div>
        </div>
        {status === 'quiz' && (
          <div className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
            {currentIndex + 1} / {questions.length}
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
              AI 将根据本课「{lessonTitle}」的内容为你生成 3 道选择题
            </p>
            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
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
            <h4 className="text-lg font-medium mb-2">AI 正在生成题目...</h4>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              根据课程内容智能出题，请稍候
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
              onClick={startQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
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

            {/* 选项 */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === currentQuestion.correctIndex
                const showCorrect = showExplanation && isCorrect
                const showWrong = showExplanation && isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showExplanation}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all duration-200 cursor-pointer
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

            {/* 答案解析 */}
            {showExplanation && (
              <div className={`
                p-4 rounded-xl mb-6
                ${isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}
              `}>
                <div className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${userAnswers[currentIndex] === currentQuestion.correctIndex 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'bg-red-500/20 text-red-500'
                    }
                  `}>
                    {userAnswers[currentIndex] === currentQuestion.correctIndex 
                      ? <CheckCircle size={14} /> 
                      : <XCircle size={14} />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      userAnswers[currentIndex] === currentQuestion.correctIndex 
                        ? 'text-accent-green' 
                        : 'text-red-500'
                    }`}>
                      {userAnswers[currentIndex] === currentQuestion.correctIndex ? '回答正确！' : '回答错误'}
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
                  disabled={selectedAnswer === null}
                  className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${selectedAnswer !== null 
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
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
            <p className={`text-base mb-8 max-w-md mx-auto ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              {result.feedback}
            </p>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startQuiz}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer
                  ${isDark 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <RefreshCw size={18} />
                再测一次
              </button>
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-black font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
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
