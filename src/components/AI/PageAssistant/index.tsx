/**
 * AI 页面助手主组件
 * 基于当前页面上下文的智能对话助手
 */

import { useState, useRef, useEffect } from 'react'
import { X, Send, RotateCcw } from 'lucide-react'
import { Logo } from '../../Logo'
import { useThemeBloc } from '../../../blocs/themeBloc'
import { usePageContext } from './hooks/usePageContext'
import { useTypingEffect } from './hooks/useTypingEffect'
import { renderMarkdown, filterThinkTags } from './utils/markdown'

// 消息类型
interface Message {
  role: 'user' | 'assistant'
  content: string
}

// 开发环境判断
const isDev = import.meta.env.DEV
const DEV_API_BASE = import.meta.env.VITE_AI_API_BASE || 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
const DEV_API_KEY = import.meta.env.VITE_AI_API_KEY || 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
const DEV_MODEL = import.meta.env.VITE_AI_MODEL || 'qwen-3-coder-480b'

export function AiPageAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [targetContent, setTargetContent] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreamComplete, setIsStreamComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'
  const pageContext = usePageContext()
  
  const { displayedContent, isTyping, reset: resetTyping, isComplete } = useTypingEffect(targetContent, isStreamComplete)

  // 监听打字完成
  useEffect(() => {
    if (isComplete) {
      setMessages(prev => [...prev, { role: 'assistant', content: targetContent }])
      setTargetContent('')
      setIsStreamComplete(false)
      resetTyping()
    }
  }, [isComplete, targetContent, resetTyping])

  // 监听 isOpen 变化
  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, displayedContent])

  // 关闭对话面板
  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    resetTyping()
    
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      setMessages([])
      setInputValue('')
      setTargetContent('')
      setIsStreamComplete(false)
    }, 200)
  }

  // 流式调用 AI API（通过后端代理）
  const callAIStream = async (chatMessages: Message[]) => {
    setIsLoading(true)
    setTargetContent('')
    setIsStreamComplete(false)
    resetTyping()
    
    abortControllerRef.current = new AbortController()
    
    const systemPrompt = `你是一个专业的 Android/Kotlin 开发专家助手。

当前页面信息：
- 页面类型：${pageContext.type}
- 页面标题：${pageContext.title}
- 页面内容：
${pageContext.content}

请基于当前页面内容回答用户的问题。回答要求：
1. 如果问题与当前页面内容相关，优先基于页面内容回答
2. 如果问题超出页面内容，可以结合你的 Android 开发知识回答
3. 回答简洁实用，重点突出
4. 代码示例用 \`\`\`kotlin 包裹
5. 使用中文回答
6. 不要使用 <think> 标签`
    
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
        // 生产环境：调用后端 API（Vercel Serverless Function）
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
  }

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || isTyping) return
    
    const newMessage: Message = { role: 'user', content: inputValue.trim() }
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    setInputValue('')
    
    await callAIStream(newMessages)
  }

  // 重新开始
  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    resetTyping()
    setMessages([])
    setInputValue('')
    setTargetContent('')
    setIsLoading(false)
    setIsStreamComplete(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div 
      data-modal="ai-page-assistant"
      className={`
        fixed inset-0 z-50 flex items-end md:items-center justify-center
        transition-opacity duration-200 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* 面板内容 */}
      <div 
        className={`
          relative w-full md:max-w-2xl 
          max-h-[85vh] md:max-h-[80vh] 
          overflow-hidden flex flex-col
          rounded-t-3xl md:rounded-3xl shadow-2xl
          transition-all duration-200 ease-out
          ${isVisible 
            ? 'opacity-100 translate-y-0 md:scale-100' 
            : 'opacity-0 translate-y-8 md:translate-y-4 md:scale-95'
          }
          ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}
        `}
      >
        {/* 移动端拖拽条 */}
        <div className="md:hidden flex justify-center py-2">
          <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
        </div>

        {/* 头部 */}
        <div className={`
          flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b shrink-0
          ${isDark ? 'border-zinc-800' : 'border-light-border-DEFAULT'}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center">
              <Logo size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm md:text-base">{pageContext.title}</h2>
              <p className={`text-xs md:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                AI 助手
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(messages.length > 0 || displayedContent) && (
              <button
                onClick={handleReset}
                className={`
                  p-2 rounded-full transition-colors duration-150 cursor-pointer
                  ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-light-bg-secondary text-light-text-muted'}
                `}
                title="重新开始"
              >
                <RotateCcw size={18} />
              </button>
            )}
            <button
              onClick={handleClose}
              className={`
                p-2 rounded-full transition-colors duration-150 cursor-pointer
                ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-light-bg-secondary'}
              `}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* 默认提示 */}
          {messages.length === 0 && !displayedContent && (
            <div className="flex justify-center items-center h-full">
              <div className={`text-center ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                <Logo size={48} className="mx-auto mb-4 text-accent-green" />
                <p className="text-sm md:text-base">{pageContext.prompt}</p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[90%] px-3 md:px-4 py-2.5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-accent-green text-dark-bg-primary'
                    : isDark 
                      ? 'bg-zinc-800/50 text-zinc-200' 
                      : 'bg-light-bg-secondary text-light-text-primary'
                  }
                `}
              >
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div 
                    className="ai-response-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content, isDark) }}
                  />
                )}
              </div>
            </div>
          ))}
          
          {/* 打字机效果显示 */}
          {displayedContent && (
            <div className="flex justify-start">
              <div
                className={`
                  max-w-[90%] px-3 md:px-4 py-2.5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed
                  ${isDark 
                    ? 'bg-zinc-800/50 text-zinc-200' 
                    : 'bg-light-bg-secondary text-light-text-primary'
                  }
                `}
              >
                <div 
                  className="ai-response-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedContent, isDark) }}
                />
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 ml-0.5 bg-accent-green animate-pulse align-middle" />
                )}
              </div>
            </div>
          )}
          
          {/* 等待加载指示器 */}
          {isLoading && !displayedContent && !targetContent && (
            <div className="flex justify-start">
              <div className={`
                px-4 py-3 rounded-2xl flex items-center gap-1.5
                ${isDark ? 'bg-zinc-800/50' : 'bg-light-bg-secondary'}
              `}>
                <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className={`
          px-4 md:px-6 py-3 md:py-4 border-t shrink-0
          ${isDark ? 'border-zinc-800' : 'border-light-border-DEFAULT'}
        `}>
          <div className="flex items-center gap-2 md:gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入你的问题..."
              className={`
                flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-accent-green/50
                ${isDark 
                  ? 'bg-zinc-800/50 text-zinc-200 placeholder-zinc-500' 
                  : 'bg-light-bg-secondary text-light-text-primary placeholder-light-text-muted'
                }
              `}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading || isTyping}
              className={`
                p-2 md:p-2.5 rounded-full transition-all duration-150 cursor-pointer
                ${inputValue.trim() && !isLoading && !isTyping
                  ? 'bg-accent-green text-white hover:bg-accent-green/90'
                  : isDark 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-light-bg-secondary text-light-text-muted cursor-not-allowed'
                }
              `}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
