import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { X, Send, RotateCcw } from 'lucide-react'
import { Logo } from './Logo'
import { useThemeBloc } from '../blocs/themeBloc'
import { getLessonById, courseData } from '../data/courses'
import { projectsData } from '../data/projects'

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
const TYPING_INTERVAL = 5
const CHARS_PER_TICK = 1

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
  html = html.replace(/^-\s+(.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-accent-green mt-1">•</span><span>$1</span></div>')
  
  // 处理换行
  html = html.replace(/\n\n/g, '</p><p class="my-3">')
  html = html.replace(/\n/g, '<br/>')
  
  return `<p class="my-2">${html}</p>`
}

/**
 * 获取当前页面的上下文信息
 */
function usePageContext() {
  const location = useLocation()
  
  // 课程详情页
  const lessonMatch = location.pathname.match(/^\/learn\/([^/]+)\/([^/]+)$/)
  if (lessonMatch) {
    const [, phaseId, lessonId] = lessonMatch
    const lesson = getLessonById(phaseId, lessonId)
    const phase = courseData.find(p => p.id === phaseId)
    
    if (lesson && phase) {
      const contentText = lesson.contents
        .filter(c => c.type === 'text' || c.type === 'code')
        .map(c => c.content)
        .join('\n')
        .slice(0, 3000) // 限制字符数
      
      return {
        type: 'lesson',
        title: `${phase.name} - ${lesson.title}`,
        content: `课程标题：${lesson.title}\n课程描述：${lesson.description}\n\n课程内容摘要：\n${contentText}`,
        prompt: '关于这节课的内容，有什么想了解的吗？'
      }
    }
  }
  
  // 项目详情页
  const projectMatch = location.pathname.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const [, projectId] = projectMatch
    const project = projectsData.find(p => p.id === projectId)
    
    if (project) {
      const features = project.features?.join('\n- ') || ''
      const steps = project.steps?.map(s => s.title).join('\n- ') || ''
      
      return {
        type: 'project',
        title: project.name,
        content: `项目名称：${project.name}\n项目描述：${project.description}\n\n主要功能：\n- ${features}\n\n开发步骤：\n- ${steps}`,
        prompt: '关于这个项目，有什么想了解的吗？'
      }
    }
  }
  
  // 学习列表页
  if (location.pathname === '/learn') {
    return {
      type: 'learn',
      title: '学习路径',
      content: `这是 Android Learn 的学习路径页面。包含 5 个学习阶段：\n1. 基础入门 - Kotlin 语法、开发环境\n2. 核心组件 - Activity、Fragment、UI 开发\n3. 数据与网络 - 本地存储、网络请求\n4. 架构进阶 - MVVM、依赖注入\n5. 实战项目 - 完整项目开发`,
      prompt: '关于 Android 学习路径，有什么想了解的吗？'
    }
  }
  
  // 项目列表页
  if (location.pathname === '/projects') {
    return {
      type: 'projects',
      title: '实战项目',
      content: `这是实战项目列表页面。包含 8 个难度递增的项目：待办清单、天气应用、新闻阅读、音乐播放器、相册应用、即时通讯、电商应用、小游戏。`,
      prompt: '关于实战项目，有什么想了解的吗？'
    }
  }
  
  // 首页
  if (location.pathname === '/') {
    return {
      type: 'home',
      title: 'Android Learn',
      content: `这是 Android Learn 首页。一个面向 AI 时代的安卓开发学习平台，帮助零基础学习者掌握安卓开发。`,
      prompt: '关于 Android 开发学习，有什么想了解的吗？'
    }
  }
  
  // 默认通用助手
  return {
    type: 'general',
    title: 'Android 开发助手',
    content: '我是你的 Android 开发助手，可以回答关于 Android 开发、Kotlin 语言、架构模式等问题。',
    prompt: '有什么 Android 开发相关的问题吗？'
  }
}

/**
 * AI 页面助手组件
 * 基于当前页面上下文的智能对话助手
 */
export function AiPageAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [displayedContent, setDisplayedContent] = useState('')
  const [targetContent, setTargetContent] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isStreamComplete, setIsStreamComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const displayIndexRef = useRef(0)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'
  const pageContext = usePageContext()

  // 监听 isOpen 变化
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 滚动到最新消息
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedContent, scrollToBottom])

  // 打字机效果
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
      onClose()
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
              content: `你是一个专业的 Android/Kotlin 开发专家助手。

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
            },
            ...chatMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: 1500,
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
      setDisplayedContent('')
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

  if (!isOpen) {
    return null
  }

  return (
    <>
      {isOpen && (
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
      )}
    </>
  )
}
