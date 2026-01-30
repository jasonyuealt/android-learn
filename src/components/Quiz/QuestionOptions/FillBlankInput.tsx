/**
 * 填空题组件
 * 用于渲染 fill_blank 题型
 */

import { CheckCircle, XCircle } from 'lucide-react'
import { checkAnswer, type QuizQuestion } from '../../../services/aiService'

interface FillBlankInputProps {
  question: QuizQuestion
  selectedAnswer: string
  showExplanation: boolean
  isDark: boolean
  onInput: (value: string) => void
}

export function FillBlankInput({
  question,
  selectedAnswer,
  showExplanation,
  isDark,
  onInput
}: FillBlankInputProps) {
  const userInput = selectedAnswer || ''
  const isCorrect = showExplanation && checkAnswer(question, userInput)
  
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => onInput(e.target.value)}
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
          正确答案：{question.correctAnswer}
        </p>
      )}
    </div>
  )
}
