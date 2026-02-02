/**
 * 通用内容解析助手组件（重构版）
 * 支持流程图（mermaid）和代码块（code）的AI解析
 */

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, X, RotateCcw } from 'lucide-react'
import { getUIConfig, getInitialMessage } from './config'
import { useAIChat } from './hooks/useAIChat'
import { ContentPreview } from './components/ContentPreview'
import { ChatArea } from './components/ChatArea'
import type { ContentAssistantProps, Message } from './types'

export function ContentAssistant({ 
  isOpen, 
  onClose, 
  contentType, 
  content, 
  language = 'kotlin',
  isDark 
}: ContentAssistantProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [initialMessage, setInitialMessage] = useState<Message | null>(null)
  const [inputValue, setInputValue] = useState('')
  
  const {
    messages,
    setMessages,
    targetContent,
    setTargetContent,
    isLoading,
    isStreamComplete,
    setIsStreamComplete,
    callAIStream,
    abort
  } = useAIChat(contentType)
  
  const uiConfig = getUIConfig(contentType)

  // 打开时初始化
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      
      // 阻止背景页面滚动
      document.body.style.overflow = 'hidden'
      
      const firstMessage: Message = {
        role: 'user',
        content: getInitialMessage(contentType, content, language)
      }
      setInitialMessage(firstMessage)
      setMessages([firstMessage])
      
      // 自动发起AI分析
      callAIStream([firstMessage])
    } else {
      // 关闭时重置
      abort()
      
      // 恢复背景页面滚动
      document.body.style.overflow = ''
      
      setIsVisible(false)
      setTimeout(() => {
        setMessages([])
        setInitialMessage(null)
        setInputValue('')
        setTargetContent('')
        setIsStreamComplete(false)
      }, 200)
    }
  }, [isOpen])

  // 发送追问
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const newMessage: Message = { role: 'user', content: inputValue.trim() }
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    setInputValue('')
    
    await callAIStream(newMessages)
  }

  // 重新开始
  const handleReset = async () => {
    abort()
    
    // 重置聊天区域的自动滚动状态
    if ((window as any).__chatAreaReset) {
      (window as any).__chatAreaReset()
    }
    
    if (initialMessage) {
      setMessages([initialMessage])
      setInputValue('')
      setTargetContent('')
      setIsStreamComplete(false)
      await callAIStream([initialMessage])
    }
  }

  // 关闭对话面板
  const handleCloseModal = () => {
    abort()
    setIsVisible(false)
    
    // 等待动画完成后再调用 onClose
    setTimeout(() => {
      onClose()
    }, 200)
  }

  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  if (!isOpen) return null

  // 使用 Portal 将弹窗渲染到 body，避免被父容器限制
  return createPortal(
    <div 
      data-modal="content-assistant"
      className={`
        fixed inset-0 z-50 flex items-end md:items-center justify-center
        transition-opacity duration-200 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCloseModal}
      />
      
      {/* 面板内容 - 增大尺寸并使用两栏布局 */}
      <div 
        className={`
          relative w-full md:max-w-6xl 
          max-h-[90vh] md:max-h-[85vh] 
          overflow-hidden flex flex-col
          rounded-t-3xl md:rounded-3xl shadow-2xl
          transition-all duration-200 ease-out
          ${isVisible 
            ? 'opacity-100 translate-y-0 md:scale-100' 
            : 'opacity-0 translate-y-8 md:translate-y-4 md:scale-95'
          }
          ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}
        `}
        style={{ touchAction: 'none' }}
        onTouchStart={(e) => {
          // 阻止整个面板的双指缩放
          if (e.touches.length > 1) {
            e.preventDefault()
          }
        }}
        onTouchMove={(e) => {
          // 阻止整个面板的双指缩放
          if (e.touches.length > 1) {
            e.preventDefault()
          }
        }}
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
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl ${uiConfig.iconBg} flex items-center justify-center`}>
              <Sparkles size={18} className={uiConfig.iconColor} />
            </div>
            <div>
              <h2 className="font-semibold text-sm md:text-base">{uiConfig.title}</h2>
              <p className={`text-xs md:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                {uiConfig.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
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
              onClick={handleCloseModal}
              className={`
                p-2 rounded-full transition-colors duration-150 cursor-pointer
                ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-light-bg-secondary'}
              `}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 内容区域 - PC端两栏布局，移动端单栏 */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* 左侧：内容预览（流程图或代码） */}
          <ContentPreview
            contentType={contentType}
            content={content}
            language={language}
            isDark={isDark}
            isOpen={isOpen}
          />

          {/* 右侧：消息列表和输入框 */}
          <ChatArea
            messages={messages}
            targetContent={targetContent}
            isStreamComplete={isStreamComplete}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            onSend={handleSend}
            onReset={handleReset}
            uiConfig={uiConfig}
            isDark={isDark}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
