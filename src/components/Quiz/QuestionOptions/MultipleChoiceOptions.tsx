/**
 * 多选题组件
 * 用于渲染 multiple_choice 题型
 */

import { CheckCircle, XCircle } from 'lucide-react'
import type { QuizQuestion } from '../../../services/aiService'

interface MultipleChoiceOptionsProps {
  question: QuizQuestion
  selectedAnswer: number[]
  showExplanation: boolean
  isDark: boolean
  onSelect: (index: number) => void
}

export function MultipleChoiceOptions({
  question,
  selectedAnswer,
  showExplanation,
  isDark,
  onSelect
}: MultipleChoiceOptionsProps) {
  const selectedIndices = selectedAnswer || []
  const correctIndices = question.correctIndex as number[]
  
  return (
    <div className="space-y-3 mb-6">
      <p className={`text-sm mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
        （可多选，请选择所有正确答案）
      </p>
      {question.options.map((option, index) => {
        const isSelected = selectedIndices.includes(index)
        const isCorrect = correctIndices.includes(index)
        const showCorrect = showExplanation && isCorrect
        const showWrong = showExplanation && isSelected && !isCorrect
        const showMissed = showExplanation && isCorrect && !isSelected

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
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
