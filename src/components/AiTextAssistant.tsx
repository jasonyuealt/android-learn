import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, X, Send, RotateCcw } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'

// 消息类型
interface Message {
  role: 'user' | 'assistant'
  content: string
}

// AI API 配置
const API_BASE = 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
const API_KEY = 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
const MODEL = 'qwen-3-32b'

// 打字机效果配置
const TYPING_INTERVAL = 5  // 每次更新间隔（毫秒）
const CHARS_PER_TICK = 1   // 每次显示的字符数

/**
 * 过滤掉 <think> 标签及其内容
 */
function filterThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

/**
 * 渲染 Markdown 格式的文本
 */
function renderMarkdown(text: string, isDark: boolean): string {
  let html = text
  
  // 处理代码块
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang || 'code'
    return `<div class="my-3 rounded-xl overflow-hidden ${isDark ? 'bg-zinc-900/80' : 'bg-gray-100'}">
      <div class="px-3 py-1.5 text-xs uppercase tracking-wider ${isDark ? 'text-zinc-500 bg-zinc-900' : 'text-gray-500 bg-gray-200/50'}">${langLabel}</div>
      <pre class="px-3 py-2 overflow-x-auto"><code class="text-xs md:text-sm font-mono ${isDark ? 'text-zinc-300' : 'text-gray-800'}">${code.trim()}</code></pre>
    </div>`
  })
  
  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded text-xs md:text-sm font-mono ${isDark ? 'bg-zinc-800 text-accent-green' : 'bg-gray-100 text-green-600'}">$1</code>`)
  
  // 处理加粗
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
  
  // 处理标题列表
  html = html.replace(/^(\d+)\.\s*\*\*([^*]+)\*\*/gm, '<div class="font-semibold mt-4 mb-2">$1. $2</div>')
  
  // 处理列表
  html = html.replace(/^-\s+(.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-accent-purple mt-1">•</span><span>$1</span></div>')
  
  // 处理换行
  html = html.replace(/\n\n/g, '</p><p class="my-3">')
  html = html.replace(/\n/g, '<br/>')
  
  return `<p class="my-2">${html}</p>`
}

/**
 * AI 文本分析助手组件
 */
export function AiTextAssistant() {
  const [selectedText, setSelectedText] = useState('')
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [showButton, setShowButton] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [displayedContent, setDisplayedContent] = useState('')
  const [targetContent, setTargetContent] = useState('') // 目标内容（来自流式或完整响应）
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isStreamComplete, setIsStreamComplete] = useState(false) // 流式是否完成
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const displayIndexRef = useRef(0) // 当前显示到的索引
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 滚动到最新消息
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedContent, scrollToBottom])

  // 独立的打字机效果 - 基于定时器，与流式返回速度无关
  useEffect(() => {
    // 清除之前的定时器
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current)
      typingTimerRef.current = null
    }

    // 如果有目标内容且还没显示完
    if (targetContent && displayIndexRef.current < targetContent.length) {
      setIsTyping(true)
      
      typingTimerRef.current = setInterval(() => {
        displayIndexRef.current += CHARS_PER_TICK
        
        if (displayIndexRef.current >= targetContent.length) {
          // 打字完成
          displayIndexRef.current = targetContent.length
          setDisplayedContent(targetContent)
          setIsTyping(false)
          
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current)
            typingTimerRef.current = null
          }
          
          // 如果流式已完成，将内容移到消息列表
          if (isStreamComplete) {
            setMessages(prev => [...prev, { role: 'assistant', content: targetContent }])
            setDisplayedContent('')
            setTargetContent('')
            displayIndexRef.current = 0
            setIsStreamComplete(false)
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
  }, [targetContent, isStreamComplete])

  // 监听文本选择
  useEffect(() => {
    const handleSelection = (e: MouseEvent | KeyboardEvent) => {
      if (isOpen) return
      
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-button]') || target.closest('[data-modal]')) return
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = range.commonAncestorContainer as HTMLElement
        const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container
        if (element?.closest('[data-modal]')) return
      }
      
      const text = selection?.toString().trim() || ''
      
      if (text.length > 2 && text.length < 500) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        
        if (rect) {
          const x = Math.max(60, Math.min(rect.left + rect.width / 2, window.innerWidth - 60))
          const y = Math.max(50, rect.top - 10)
          
          setSelectedText(text)
          setButtonPosition({ x, y })
          setShowButton(true)
        }
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-button]')) return
      setShowButton(false)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    document.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isOpen])

  // 打开对话面板
  const handleOpenChat = async () => {
    setShowButton(false)
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
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current)
    }
    
    setIsVisible(false)
    setTimeout(() => {
      setIsOpen(false)
      setMessages([])
      setInputValue('')
      setDisplayedContent('')
      setTargetContent('')
      setIsTyping(false)
      setIsStreamComplete(false)
      displayIndexRef.current = 0
    }, 200)
  }

  // 流式调用 AI API
  const callAIStream = async (chatMessages: Message[]) => {
    setIsLoading(true)
    setDisplayedContent('')
    setTargetContent('')
    setIsStreamComplete(false)
    displayIndexRef.current = 0
    
    abortControllerRef.current = new AbortController()
    
    try {
      const response = await fetch(`${API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的 Android/Kotlin 开发助手。用户正在学习 Android 开发，会选中一些代码或文本让你解释。

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
            },
            ...chatMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      })

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
                  // 更新目标内容，打字机会自动追赶
                  setTargetContent(filterThinkTags(accumulatedContent))
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      }

      // 流式完成
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
      setDisplayedContent('')
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
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current)
    }
    setMessages([])
    setInputValue('')
    setDisplayedContent('')
    setTargetContent('')
    setIsLoading(false)
    setIsTyping(false)
    setIsStreamComplete(false)
    displayIndexRef.current = 0
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
