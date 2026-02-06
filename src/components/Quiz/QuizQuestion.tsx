/**
 * 测验题目组件
 * 负责渲染题目、选项和解析
 */

import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { checkAnswer, type QuizQuestion } from '../../services/aiService'
import { SingleChoiceOptions } from './QuestionOptions/SingleChoiceOptions'
import { MultipleChoiceOptions } from './QuestionOptions/MultipleChoiceOptions'
import { FillBlankInput } from './QuestionOptions/FillBlankInput'
import { ValidateButton } from './ValidateButton'

interface QuizQuestionProps {
  question: QuizQuestion
  currentIndex: number
  totalQuestions: number
  selectedAnswer: number | number[] | string | null
  showExplanation: boolean
  userAnswer: number | number[] | string | undefined
  isDark: boolean
  lessonTitle: string
  lessonContent: string
  onSelectSingle: (index: number) => void
  onSelectMultiple: (index: number) => void
  onInputAnswer: (value: string) => void
  onConfirm: () => void
  onNext: () => void
  onRegenerate: (newQuestion: QuizQuestion) => void
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
  lessonTitle,
  lessonContent,
  onSelectSingle,
  onSelectMultiple,
  onInputAnswer,
  onConfirm,
  onNext,
  onRegenerate,
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

      {/* 场景描述（如果有） */}
      {question.scenario && (
        <div className={`
          mb-6 p-3.5 rounded-2xl border transition-all duration-200
          ${isDark 
            ? 'bg-accent-blue/5 border-accent-blue/20' 
            : 'bg-blue-50/50 border-blue-100'
          }
        `}>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
            {question.scenario}
          </p>
        </div>
      )}

      {/* 代码示例（如果有） */}
      {question.codeSnippet && (
        <div className="mb-6">
          <pre className={`
            p-4 rounded-2xl text-sm overflow-x-auto font-mono border transition-all duration-200
            ${isDark 
              ? 'bg-zinc-900 text-zinc-300 border-zinc-800' 
              : 'bg-gray-50 text-gray-800 border-gray-200'
            }
          `}>
            <code>{question.codeSnippet}</code>
          </pre>
        </div>
      )}

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
            <div className="flex-1">
              <p className={`text-sm font-medium mb-1 ${
                isCurrentAnswerCorrect 
                  ? 'text-accent-green' 
                  : 'text-red-500'
              }`}>
                {isCurrentAnswerCorrect ? '回答正确！' : '回答错误'}
              </p>
              <p className={`text-sm mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                {question.explanation}
              </p>
              {/* AI 验证题目按钮 */}
              <ValidateButton
                question={question}
                lessonTitle={lessonTitle}
                lessonContent={lessonContent}
                isDark={isDark}
                onRegenerate={onRegenerate}
              />
            </div>
          </div>
        </div>
      )}

      {/* 移动端：底部按钮 */}
      <div className="flex justify-end md:hidden">
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
