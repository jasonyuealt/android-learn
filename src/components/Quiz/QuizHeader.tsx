/**
 * 测验头部组件
 * 显示标题、描述和进度信息
 */

import { Brain } from 'lucide-react'
import { getQuestionTypeName, type QuizQuestion } from '../../services/aiService'

interface QuizHeaderProps {
  status: 'idle' | 'loading' | 'quiz' | 'result' | 'error'
  currentQuestion: QuizQuestion | null
  currentIndex: number
  totalQuestions: number
  isDark: boolean
}

export function QuizHeader({ status, currentQuestion, currentIndex, totalQuestions, isDark }: QuizHeaderProps) {
  return (
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
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      )}
    </div>
  )
}
