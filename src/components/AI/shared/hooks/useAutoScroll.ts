/**
 * 智能自动滚动 Hook
 * 用户没滚动时自动滚动，用户一旦向上滚动就停止
 * 支持移动端触摸和PC端鼠标滚轮
 * 支持条件渲染（弹窗打开后才渲染 DOM）
 */

import { useRef, useCallback, useState } from 'react'

export function useAutoScroll() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userHasScrolledRef = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [, forceUpdate] = useState(0)

  // 使用 callback ref 处理条件渲染
  const scrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    // 清理旧的事件监听器
    if (containerRef.current) {
      containerRef.current.removeEventListener('touchstart', handleTouchStart)
      containerRef.current.removeEventListener('wheel', handleWheel)
    }

    containerRef.current = node

    // 添加新的事件监听器
    if (node) {
      node.addEventListener('touchstart', handleTouchStart, { passive: true })
      node.addEventListener('wheel', handleWheel, { passive: true })
      forceUpdate(n => n + 1) // 触发重新渲染以确保 ref 更新
    }
  }, [])

  // 移动端：监听触摸开始（向上滑动）
  const handleTouchStart = () => {
    userHasScrolledRef.current = true
  }

  // PC端：只检测向上滚动
  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      userHasScrolledRef.current = true
    }
  }

  // 滚动到底部（使用同步滚动，避免与用户滚动冲突）
  const scrollToBottom = useCallback(() => {
    if (userHasScrolledRef.current) return

    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [])

  // 重置（用于新对话开始）
  const resetAutoScroll = useCallback(() => {
    userHasScrolledRef.current = false
  }, [])

  return {
    scrollContainerRef,
    messagesEndRef,
    scrollToBottom,
    resetAutoScroll
  }
}
