/**
 * AI 对话 Hook
 * 处理流式调用和消息管理
 */

import { useState, useRef, useCallback } from 'react'
import { isDev, DEV_API_BASE, DEV_API_KEY, DEV_MODEL, getSystemPrompt } from '../config'
import { filterThinkTags } from '../../PageAssistant/utils/markdown'
import type { Message } from '../types'

export function useAIChat(contentType: 'mermaid' | 'code') {
  const [messages, setMessages] = useState<Message[]>([])
  const [targetContent, setTargetContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreamComplete, setIsStreamComplete] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const callAIStream = useCallback(async (chatMessages: Message[]) => {
    setIsLoading(true)
    setTargetContent('')
    setIsStreamComplete(false)
    
    abortControllerRef.current = new AbortController()
    const systemPrompt = getSystemPrompt(contentType)
    
    try {
      let response: Response
      
      if (isDev) {
        // 开发环境：直接调用 AI API
        response = await fetch(`${DEV_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEV_API_KEY}`
          },
          body: JSON.stringify({
            model: DEV_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              ...chatMessages
            ],
            max_tokens: 1500,
            temperature: 0.7,
            stream: true
          }),
          signal: abortControllerRef.current.signal,
        })
      } else {
        // 生产环境：调用后端 API
        response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: chatMessages,
            systemPrompt: systemPrompt,
            maxTokens: 1500,
            temperature: 0.7,
            stream: true
          }),
          signal: abortControllerRef.current.signal,
        })
      }

      if (!response.ok) {
        throw new Error('AI 请求失败')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''
                if (content) {
                  accumulatedContent += content
                  setTargetContent(filterThinkTags(accumulatedContent))
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      }

      const filteredContent = filterThinkTags(accumulatedContent)
      setTargetContent(filteredContent)
      setIsStreamComplete(true)
      setIsLoading(false)
      
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return
      }
      console.error('AI error:', error)
      const errorMsg = '抱歉，AI 服务暂时不可用，请稍后再试。'
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
      setTargetContent('')
      setIsLoading(false)
    }
  }, [contentType])

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    messages,
    setMessages,
    targetContent,
    setTargetContent,
    isLoading,
    isStreamComplete,
    setIsStreamComplete,
    callAIStream,
    abort
  }
}
