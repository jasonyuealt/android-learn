/**
 * 报告错题按钮组件
 * 允许用户标记可能存在错误的题目
 */

import { useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface ReportButtonProps {
  questionId: string
  questionText: string
  isDark: boolean
  onReport: () => void
}

export function ReportButton({ questionId, questionText, isDark, onReport }: ReportButtonProps) {
  const [reported, setReported] = useState(false)
  
  const handleReport = () => {
    // 保存报告到本地存储
    const reports = JSON.parse(localStorage.getItem('quizReports') || '[]')
    reports.push({
      questionId,
      questionText,
      timestamp: Date.now(),
      url: window.location.href
    })
    localStorage.setItem('quizReports', JSON.stringify(reports))
    
    console.log('报告错题:', { questionId, questionText, timestamp: Date.now() })
    setReported(true)
    onReport()
  }
  
  if (reported) {
    return (
      <div className="text-xs text-accent-green flex items-center gap-1.5">
        <CheckCircle size={12} />
        <span>已报告，感谢反馈</span>
      </div>
    )
  }
  
  return (
    <button
      onClick={handleReport}
      className={`
        text-xs flex items-center gap-1.5 transition-all duration-200 rounded-lg px-2 py-1 -ml-2
        ${isDark 
          ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }
      `}
      title="如果题目有知识性错误，请点击报告"
    >
      <AlertTriangle size={12} />
      <span>报告题目错误</span>
    </button>
  )
}
