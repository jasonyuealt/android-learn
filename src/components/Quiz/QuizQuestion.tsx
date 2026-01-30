/**
 * 测验题目组件
 * 负责渲染题目、选项和解析
 */

import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { checkAnswer, type QuizQuestion } from '../../services/aiService'
import { SingleChoiceOptions } from './QuestionOptions/SingleChoiceOptions'
import { MultipleChoiceOptions } from './QuestionOptions/MultipleChoiceOptions'
import { FillBlankInput } from './QuestionOptions/FillBlankInput'

interface QuizQuestionProps {
  question: QuizQuestion
  currentIndex: number
  totalQuestions: number
  selectedAnswer: number | number[] | string | null
  showExplanation: boolean
  userAnswer: number | number[] | string | undefined
  isDark: boolean
  onSelectSingle: (index: number) => void
  onSelectMultiple: (index: number) => void
  onInputAnswer: (value: string) => void
  onConfirm: () => void
  onNext: () => void
  canSubmit: boolean
}

export function QuizQuestionComponent({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  userAnswer,
  isDark,
  onSelectSingle,
  onSelectMultiple,
  onInputAnswer,
  onConfirm,
  onNext,
  canSubmit
}: QuizQuestionProps) {
  // 检查当前答案是否正确
  const isCurrentAnswerCorrect = userAnswer !== undefined
    ? checkAnswer(question, userAnswer)
    : false

  // 渲染题目选项/输入框
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceOptions
            question={question}
            selectedAnswer={(selectedAnswer as number[]) || []}
            showExplanation={showExplanation}
            isDark={isDark}
            onSelect={onSelectMultiple}
          />
        )
      case 'fill_blank':
        return (
          <FillBlankInput
            question={question}
            selectedAnswer={(selectedAnswer as string) || ''}
            showExplanation={showExplanation}
            isDark={isDark}
            onInput={onInputAnswer}
          />
        )
      case 'single_choice':
      case 'true_false':
      default:
        return (
          <SingleChoiceOptions
            question={question}
            selectedAnswer={selectedAnswer as number | null}
            showExplanation={showExplanation}
            isDark={isDark}
            onSelect={onSelectSingle}
          />
        )
    }
  }

  return (
    <div>
      {/* 进度条 */}
      <div className={`h-1.5 rounded-full mb-8 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
        <div 
          className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-green transition-all duration-300"
          style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* 题目 */}
      <h4 className="text-lg font-medium mb-6">{question.question}</h4>

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
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={onConfirm}
            disabled={!canSubmit}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200
              ${canSubmit
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
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
          >
            {currentIndex < totalQuestions - 1 ? (
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
  )
}
