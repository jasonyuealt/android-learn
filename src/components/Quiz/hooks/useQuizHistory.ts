/**
 * 测验历史记录管理 Hook
 * 负责加载和保存测验历史到 Supabase
 */

import { useState, useCallback, useEffect } from 'react'
import { QuizHistory } from '../../../services/aiService'
import { saveQuizHistory, loadQuizHistory } from '../../../services/supabaseService'
import { useAuthBloc } from '../../../blocs/authBloc'

export function useQuizHistory(lessonId: string) {
  const { currentUser } = useAuthBloc()
  const [quizHistory, setQuizHistory] = useState<QuizHistory | null>(null)
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false)

  // 从云端加载历史记录
  const loadHistory = useCallback(async (): Promise<QuizHistory | null> => {
    try {
      // 用户必须登录才能使用测验功能
      if (!currentUser) {
        console.warn('用户未登录，无法加载测验历史')
        return null
      }
      
      // 从 Supabase 加载
      const cloudHistory = await loadQuizHistory(currentUser.id, lessonId)
      return cloudHistory
    } catch (e) {
      console.error('加载测验历史失败:', e)
      return null
    }
  }, [lessonId, currentUser])

  // 保存历史记录到云端
  const saveHistory = useCallback(async (history: QuizHistory) => {
    try {
      // 用户必须登录才能保存
      if (!currentUser) {
        console.warn('用户未登录，无法保存测验历史')
        return
      }
      
      // 保存到 Supabase
      await saveQuizHistory(currentUser.id, lessonId, history)
    } catch (e) {
      console.error('保存测验历史失败:', e)
    }
  }, [lessonId, currentUser])

  // 当 lessonId 改变时，重置加载状态
  useEffect(() => {
    setIsHistoryLoaded(false)
    setQuizHistory(null)
  }, [lessonId])

  // 组件加载时，预加载历史记录（等用户加载完成）
  useEffect(() => {
    if (!isHistoryLoaded && currentUser) {
      loadHistory().then(history => {
        if (history) {
          setQuizHistory(history)
        }
        setIsHistoryLoaded(true)
      })
    }
  }, [loadHistory, isHistoryLoaded, currentUser])

  return {
    quizHistory,
    setQuizHistory,
    isHistoryLoaded,
    setIsHistoryLoaded,
    loadHistory,
    saveHistory
  }
}
