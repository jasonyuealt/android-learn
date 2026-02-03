/**
 * 打字机效果 Hook
 * 实现流式文本的打字机动画（每次显示多个字符，使用 RAF）
 */

import { useState, useEffect, useRef } from 'react'

// 基准速度和配置
const BASE_SPEED = 2  // 2ms 每次更新
const CHARS_PER_TICK = 5  // 每次显示 5 个字符
const SPEED_VARIATION = 1  // 速度随机波动 ±1ms

/**
 * 生成随机速度（基准速度 ± 波动范围）
 * 范围：1-3ms/次（相当于 0.2-0.6ms/字符）
 */
function getRandomSpeed(): number {
  return BASE_SPEED + (Math.random() * 2 - 1) * SPEED_VARIATION
}

export function useTypingEffect(targetContent: string, isStreamComplete: boolean) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const currentCharIndexRef = useRef(0)
  const lastUpdateTimeRef = useRef(0)
  const nextUpdateDelayRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // 如果没有内容，重置状态
    if (!targetContent) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      setDisplayedContent('')
      setIsTyping(false)
      currentCharIndexRef.current = 0
      return
    }

    // 如果已经显示完成，直接返回
    if (currentCharIndexRef.current >= targetContent.length) {
      setDisplayedContent(targetContent)
      setIsTyping(false)
      return
    }

    // 如果 targetContent 增加了（流式数据），继续打字
    if (currentCharIndexRef.current < targetContent.length) {
      // 如果还没开始动画，开始
      if (!rafIdRef.current) {
        setIsTyping(true)
        lastUpdateTimeRef.current = performance.now()
        nextUpdateDelayRef.current = getRandomSpeed()

        const animate = (currentTime: number) => {
          const elapsed = currentTime - lastUpdateTimeRef.current

          // 如果达到下次更新时间
          if (elapsed >= nextUpdateDelayRef.current) {
            // 每次增加多个字符
            currentCharIndexRef.current = Math.min(
              currentCharIndexRef.current + CHARS_PER_TICK,
              targetContent.length
            )

            // 显示到当前字符
            const displayText = targetContent.slice(0, currentCharIndexRef.current)
            setDisplayedContent(displayText)

            // 如果还没显示完，继续
            if (currentCharIndexRef.current < targetContent.length) {
              lastUpdateTimeRef.current = currentTime
              nextUpdateDelayRef.current = getRandomSpeed()
              rafIdRef.current = requestAnimationFrame(animate)
            } else {
              // 显示完成
              setDisplayedContent(targetContent)
              setIsTyping(false)
              rafIdRef.current = null
            }
          } else {
            // 还没到更新时间，继续等待
            rafIdRef.current = requestAnimationFrame(animate)
          }
        }

        rafIdRef.current = requestAnimationFrame(animate)
      }
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [targetContent])

  const reset = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    setDisplayedContent('')
    setIsTyping(false)
    currentCharIndexRef.current = 0
  }

  return {
    displayedContent,
    isTyping,
    reset,
    isComplete: isTyping === false && currentCharIndexRef.current === targetContent.length && isStreamComplete
  }
}
