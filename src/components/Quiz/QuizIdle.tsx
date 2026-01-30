/**
 * 测验初始状态组件
 * 显示开始测验按钮和错题提示
 */

import { Brain, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import type { QuizHistory } from '../../services/aiService'

interface QuizIdleProps {
  lessonTitle: string
  quizHistory: QuizHistory | null
  isDark: boolean
  onStart: (isRetry: boolean) => void
}

export function QuizIdle({ lessonTitle, quizHistory, isDark, onStart }: QuizIdleProps) {
  const hasWrongQuestions = quizHistory && quizHistory.wrongQuestions.length > 0

  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/10 mb-4">
        <Sparkles className="w-8 h-8 text-accent-blue" />
      </div>
      <h4 className="text-lg font-medium mb-2">准备好检验学习成果了吗？</h4>
      <p className={`text-sm mb-6 max-w-md mx-auto ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
        AI 将根据本课「{lessonTitle}」的内容智能生成测验题目，
        包含单选、多选、判断、填空等多种题型
      </p>
      
      {/* 错题提示 */}
      {hasWrongQuestions && (
        <div className={`
          max-w-md mx-auto mb-6 p-4 rounded-2xl border-2
          ${isDark 
            ? 'bg-accent-orange/5 border-accent-orange/20' 
            : 'bg-accent-orange/10 border-accent-orange/30'
          }
        `}>
          <div className="flex items-center gap-2 justify-center mb-2">
            <AlertCircle className="w-5 h-5 text-accent-orange" />
            <span className="font-medium text-accent-orange">
              上次测验有 {quizHistory!.wrongQuestions.length} 道错题
            </span>
          </div>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
            建议先复习相关知识点，或点击"针对错题再测"重点练习
          </p>
        </div>
      )}
      
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onStart(false)}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent-blue text-white font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200"
        >
          <Brain size={18} />
          {hasWrongQuestions ? '全新题目' : '开始测验'}
        </button>
        
        {hasWrongQuestions && (
          <button
            onClick={() => onStart(true)}
            className={`
              inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium cursor-pointer transition-all duration-200
              ${isDark 
                ? 'bg-accent-orange/15 text-accent-orange hover:bg-accent-orange/20' 
                : 'bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20'
              }
            `}
          >
            <RefreshCw size={18} />
            针对错题再测
          </button>
        )}
      </div>
    </div>
  )
}
