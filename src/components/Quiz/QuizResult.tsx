/**
 * 测验结果组件
 * 显示分数、反馈和操作按钮
 */

import { Award, RefreshCw, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import type { QuizResult } from '../../services/aiService'

interface QuizResultProps {
  result: QuizResult
  isDark: boolean
  onRetry: () => void
  onNewQuiz: () => void
  onComplete: () => void
}

export function QuizResultComponent({ result, isDark, onRetry, onNewQuiz, onComplete }: QuizResultProps) {
  return (
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
            onClick={onRetry}
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
          onClick={onNewQuiz}
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
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-green text-black font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
        >
          <CheckCircle size={18} />
          完成
        </button>
      </div>
    </div>
  )
}
