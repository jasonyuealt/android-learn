/**
 * 智能自动滚动 Hook
 * 用户没滚动时自动滚动，用户一旦滚动就永久停止
 * 支持移动端触摸和PC端鼠标滚轮
 */

import { useEffect, useRef, useCallback } from 'react'

export function useAutoScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userHasScrolledRef = useRef(false) // 用户是否滚动过

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    // 用户一旦滚动过，就永久停止自动滚动
    if (userHasScrolledRef.current) {
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // 重置（用于重置按钮）
  const resetAutoScroll = useCallback(() => {
    userHasScrolledRef.current = false
  }, [])

  // 监听用户滚动
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // 移动端：监听触摸开始
    const handleTouchStart = () => {
      userHasScrolledRef.current = true
    }

    // PC端：监听鼠标滚轮
    const handleWheel = () => {
      userHasScrolledRef.current = true
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: true })
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return {
    scrollContainerRef,
    messagesEndRef,
    scrollToBottom,
    resetAutoScroll
  }
}
