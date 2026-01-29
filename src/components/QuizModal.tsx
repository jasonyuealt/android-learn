import { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, Loader2, Brain, RefreshCw, ChevronRight, Award, AlertTriangle } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { generateQuiz, calculateQuizResult, QuizQuestion, QuizResult } from '../services/aiService'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  lessonTitle: string
  lessonContent: string
  onComplete?: (score: number) => void
}

/**
 * AI 小测验模态框组件
 * 根据课程内容实时生成测验题目
 */
export function QuizModal({ isOpen, onClose, lessonTitle, lessonContent, onComplete }: QuizModalProps) {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 状态管理
  const [status, setStatus] = useState<'loading' | 'quiz' | 'result' | 'error'>('loading')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string>('')

  // 当模态框打开时生成测验
  useEffect(() => {
    if (isOpen) {
      loadQuiz()
    }
  }, [isOpen, lessonTitle])

  // 加载测验
  const loadQuiz = async () => {
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

  // 关闭模态框
  const handleClose = () => {
    onClose()
    // 延迟重置状态，避免闪烁
    setTimeout(() => {
      setStatus('loading')
      setQuestions([])
      setCurrentIndex(0)
      setUserAnswers([])
      setSelectedAnswer(null)
      setShowExplanation(false)
      setResult(null)
    }, 300)
  }

  if (!isOpen) return null

  const currentQuestion = questions[currentIndex]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 模态框内容 */}
      <div
        className={`
          relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8
          animate-scale-in
          ${isDark 
            ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_25px_50px_rgba(0,0,0,0.5)]' 
            : 'bg-white shadow-2xl'
          }
        `}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className={`
            absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 cursor-pointer
            ${isDark 
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }
          `}
          aria-label="关闭"
        >
          <X size={20} />
        </button>

        {/* 加载状态 */}
        {status === 'loading' && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-green/15 mb-6">
              <Brain className="w-8 h-8 text-accent-green animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI 正在生成测验...</h3>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              根据「{lessonTitle}」内容智能出题
            </p>
            <Loader2 className="w-6 h-6 mx-auto mt-6 animate-spin text-accent-green" />
          </div>
        )}

        {/* 错误状态 */}
        {status === 'error' && (
          <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/15 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">生成失败</h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {error}
            </p>
            <button
              onClick={loadQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-black font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
            >
              <RefreshCw size={18} />
              重试
            </button>
          </div>
        )}

        {/* 测验题目 */}
        {status === 'quiz' && currentQuestion && (
          <div>
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-green/15 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <h3 className="font-semibold">AI 小测验</h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                    {lessonTitle}
                  </p>
                </div>
              </div>
              {/* 进度指示器 */}
              <div className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                {currentIndex + 1} / {questions.length}
              </div>
            </div>

            {/* 进度条 */}
            <div className={`h-1 rounded-full mb-8 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
              <div 
                className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-300"
                style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>

            {/* 题目 */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-6">{currentQuestion.question}</h4>

              {/* 选项 */}
              <div className="space-y-3">
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
                        {/* 选项标签 */}
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
                      ? 'bg-accent-green text-black cursor-pointer hover:shadow-lg hover:shadow-accent-green/20' 
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-black font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
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
          <div className="py-8 text-center">
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
                onClick={loadQuiz}
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
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-black font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
              >
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
