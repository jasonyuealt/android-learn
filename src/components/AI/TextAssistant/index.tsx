/**
 * AI 文本分析助手组件
 * 选中文本后弹出 AI 分析
 */

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, RotateCcw } from 'lucide-react'
import { useThemeBloc } from '../../../blocs/themeBloc'
import { useTextSelection } from './hooks/useTextSelection'
import { useTypingEffect } from '../PageAssistant/hooks/useTypingEffect'
import { renderMarkdown, filterThinkTags } from '../PageAssistant/utils/markdown'

// 消息类型
interface Message {
  role: 'user' | 'assistant'
  content: string
}

// 开发环境判断
const isDev = import.meta.env.DEV
const DEV_API_BASE = import.meta.env.VITE_AI_API_BASE || 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
const DEV_API_KEY = import.meta.env.VITE_AI_API_KEY || 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
const DEV_MODEL = import.meta.env.VITE_AI_MODEL || 'qwen-3-32b'

export function AiTextAssistant() {
  const [isOpen, setIsOpen] = useState(false)
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
  
  const { selectedText, buttonPosition, showButton, hideButton } = useTextSelection(isOpen)
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

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, displayedContent])

  // 打开对话面板
  const handleOpenChat = async () => {
    hideButton()
    setIsOpen(true)
    requestAnimationFrame(() => setIsVisible(true))
    
    const initialMessage: Message = {
      role: 'user',
      content: `请分析这段代码或文本在 Android/Kotlin 开发中的含义：\n\n"${selectedText}"`
    }
    setMessages([initialMessage])
    
    await callAIStream([initialMessage])
  }

  // 关闭对话面板
  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    resetTyping()
    
    setIsVisible(false)
    setTimeout(() => {
      setIsOpen(false)
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
    
    const systemPrompt = `你是一个专业的 Android/Kotlin 开发助手。用户正在学习 Android 开发，会选中一些代码或文本让你解释。

请按以下顺序和格式回答（使用中文）：

1. **术语解释**
如果选中的内容包含专业术语、类名、函数名等，先用一句话简单解释它是什么。

2. **作用与用法**
说明它在实际开发中的作用和使用方法，可以给出简短的代码示例。

3. **常见场景**
列举 1-2 个典型的使用场景。

4. **注意事项**（如果有）
简要提醒容易出错或需要注意的地方。

要求：
- 回答简洁实用，每个部分 2-3 句话即可
- 代码示例用 \`\`\`kotlin 包裹
- 不要使用 <think> 标签`
    
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
            max_tokens: 1000,
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
            maxTokens: 1000,
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

  // 发送追问
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

  return (
    <>
      {/* 浮动按钮 */}
      {showButton && (
        <button
          data-ai-button
          onClick={handleOpenChat}
          style={{
            position: 'fixed',
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg cursor-pointer transition-all duration-200 ease-out animate-fade-in bg-accent-purple text-white hover:bg-accent-purple/90"
        >
          <Sparkles size={14} />
          AI 分析
        </button>
      )}

      {/* 对话面板 */}
      {isOpen && (
        <div 
          data-modal="ai-assistant"
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
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-accent-purple/15 flex items-center justify-center">
                  <Sparkles size={18} className="text-accent-purple" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm md:text-base">AI 代码分析</h2>
                  <p className={`text-xs md:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                    智能解读代码含义
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
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[90%] px-3 md:px-4 py-2.5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-accent-purple text-white'
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
                      <span className="inline-block w-0.5 h-4 ml-0.5 bg-accent-purple animate-pulse align-middle" />
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
                    <span className="inline-block w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="inline-block w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="inline-block w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  placeholder="继续提问..."
                  className={`
                    flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm
                    transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-accent-purple/50
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
                      ? 'bg-accent-purple text-white hover:bg-accent-purple/90'
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
      )}
    </>
  )
}
