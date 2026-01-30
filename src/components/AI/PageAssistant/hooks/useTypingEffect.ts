/**
 * 打字机效果 Hook
 * 实现流式文本的打字机动画
 */

import { useState, useEffect, useRef } from 'react'

const TYPING_INTERVAL = 5
const CHARS_PER_TICK = 1

export function useTypingEffect(targetContent: string, isStreamComplete: boolean) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const displayIndexRef = useRef(0)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current)
      typingTimerRef.current = null
    }

    if (targetContent && displayIndexRef.current < targetContent.length) {
      setIsTyping(true)
      
      typingTimerRef.current = setInterval(() => {
        displayIndexRef.current += CHARS_PER_TICK
        
        if (displayIndexRef.current >= targetContent.length) {
          displayIndexRef.current = targetContent.length
          setDisplayedContent(targetContent)
          setIsTyping(false)
          
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current)
            typingTimerRef.current = null
          }
        } else {
          setDisplayedContent(targetContent.slice(0, displayIndexRef.current))
        }
      }, TYPING_INTERVAL)
    }

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current)
      }
    }
  }, [targetContent])

  const reset = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current)
    }
    setDisplayedContent('')
    setIsTyping(false)
    displayIndexRef.current = 0
  }

  return {
    displayedContent,
    isTyping,
    reset,
    isComplete: isTyping === false && displayIndexRef.current === targetContent.length && isStreamComplete
  }
}
