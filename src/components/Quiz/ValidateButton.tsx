/**
 * AI 验证题目按钮组件
 * 检测题目是否有问题，如果有问题可以重新生成
 */

import { useState } from 'react'
import { Search, CheckCircle, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'
import { QuizQuestion, QuestionValidation, aiValidateQuestion, regenerateSingleQuestion } from '../../services/aiService'

type ValidateStatus = 'idle' | 'validating' | 'no_issue' | 'has_issue' | 'regenerating'

interface ValidateButtonProps {
  question: QuizQuestion
  lessonTitle: string
  lessonContent: string
  isDark: boolean
  onRegenerate: (newQuestion: QuizQuestion) => void
}

export function ValidateButton({
  question,
  lessonTitle,
  lessonContent,
  isDark,
  onRegenerate
}: ValidateButtonProps) {
  const [status, setStatus] = useState<ValidateStatus>('idle')
  const [validation, setValidation] = useState<QuestionValidation | null>(null)
  const [error, setError] = useState<string>('')

  // 验证题目
  const handleValidate = async () => {
    setStatus('validating')
    setError('')

    try {
      const result = await aiValidateQuestion(question, lessonContent)
      setValidation(result)
      setStatus(result.hasIssue ? 'has_issue' : 'no_issue')
    } catch (err) {
      setError(err instanceof Error ? err.message : '验证失败')
      setStatus('idle')
    }
  }

  // 重新生成题目
  const handleRegenerate = async () => {
    if (!validation?.description) return

    setStatus('regenerating')
    setError('')

    try {
      const newQuestion = await regenerateSingleQuestion(
        question,
        lessonTitle,
        lessonContent,
        validation.description
      )
      onRegenerate(newQuestion)
      setStatus('idle')
      setValidation(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '重新生成失败')
      setStatus('has_issue') // 回到显示问题状态
    }
  }

  // 获取问题类型的中文描述
  const getIssueTypeName = (type?: string) => {
    const names: Record<string, string> = {
      'unclear': '表述不清',
      'wrong_answer': '答案有误',
      'out_of_scope': '超出范围',
      'bad_options': '选项不合理'
    }
    return type ? names[type] || '存在问题' : '存在问题'
  }

  // 初始状态：显示检测按钮
  if (status === 'idle') {
    return (
      <div className="space-y-2">
        <button
          onClick={handleValidate}
          className={`
            text-xs flex items-center gap-1.5 transition-all duration-200 rounded-lg px-2 py-1 -ml-2
            ${isDark
              ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }
          `}
          title="AI 检测题目是否有问题"
        >
          <Search size={12} />
          <span>检测题目</span>
        </button>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }

  // 验证中
  if (status === 'validating') {
    return (
      <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
        <Loader2 size={12} className="animate-spin" />
        <span>AI 检测中...</span>
      </div>
    )
  }

  // 没有问题
  if (status === 'no_issue') {
    return (
      <div className="text-xs text-accent-green flex items-center gap-1.5">
        <CheckCircle size={12} />
        <span>题目正确，无需修改</span>
      </div>
    )
  }

  // 有问题
  if (status === 'has_issue' && validation) {
    return (
      <div className="space-y-2">
        <div className={`
          text-xs p-2 rounded-lg
          ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}
        `}>
          <div className="flex items-center gap-1.5 font-medium mb-1">
            <AlertTriangle size={12} />
            <span>{getIssueTypeName(validation.issueType)}</span>
          </div>
          <p className="opacity-80">{validation.description}</p>
        </div>
        <button
          onClick={handleRegenerate}
          className={`
            text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
            bg-accent-purple text-white hover:bg-accent-purple/90
          `}
        >
          <RefreshCw size={12} />
          <span>重新生成题目</span>
        </button>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }

  // 重新生成中
  if (status === 'regenerating') {
    return (
      <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
        <Loader2 size={12} className="animate-spin" />
        <span>重新生成中...</span>
      </div>
    )
  }

  return null
}
