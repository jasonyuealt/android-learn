/**
 * 聊天区域组件
 * 右侧显示消息列表和输入框
 */

import { useEffect } from 'react'
import { Send } from 'lucide-react'
import { useTypingEffect } from '../../PageAssistant/hooks/useTypingEffect'
import { renderMarkdown } from '../../PageAssistant/utils/markdown'
import { useAutoScroll } from '../hooks/useAutoScroll'
import type { Message, UIConfig } from '../types'

interface ChatAreaProps {
  messages: Message[]
  targetContent: string
  isStreamComplete: boolean
  inputValue: string
  setInputValue: (value: string) => void
  isLoading: boolean
  onSend: () => void
  onReset?: () => void
  uiConfig: UIConfig
  isDark: boolean
}

export function ChatArea({
  messages,
  targetContent,
  isStreamComplete,
  inputValue,
  setInputValue,
  isLoading,
  onSend,
  onReset,
  uiConfig,
  isDark
}: ChatAreaProps) {
  const { displayedContent, isTyping } = useTypingEffect(targetContent, isStreamComplete)
  const { scrollContainerRef, messagesEndRef, scrollToBottom, resetAutoScroll } = useAutoScroll()

  // 自动滚动：每次内容更新都尝试滚动（内部会判断是否需要）
  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedContent, scrollToBottom])

  // 暴露重置方法给父组件
  useEffect(() => {
    if (onReset) {
      (window as any).__chatAreaReset = resetAutoScroll
    }
    return () => {
      delete (window as any).__chatAreaReset
    }
  }, [onReset, resetAutoScroll])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 消息列表 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[90%] px-3 md:px-4 py-2.5 md:py-3 rounded-2xl text-xs md:text-sm leading-relaxed
                ${msg.role === 'user'
                  ? `${uiConfig.buttonBg} text-white`
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
                <span className={`inline-block w-0.5 h-4 ml-0.5 ${uiConfig.cursorColor} animate-pulse align-middle`} />
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
              <span className={`inline-block w-2 h-2 ${uiConfig.buttonBg} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
              <span className={`inline-block w-2 h-2 ${uiConfig.buttonBg} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
              <span className={`inline-block w-2 h-2 ${uiConfig.buttonBg} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
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
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="继续提问..."
            className={`
              flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm
              transition-colors duration-150
              focus:outline-none focus:ring-2 ${uiConfig.ringColor}
              ${isDark 
                ? 'bg-zinc-800/50 text-zinc-200 placeholder-zinc-500' 
                : 'bg-light-bg-secondary text-light-text-primary placeholder-light-text-muted'
              }
            `}
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isLoading || isTyping}
            className={`
              p-2 md:p-2.5 rounded-full transition-all duration-150 cursor-pointer
              ${inputValue.trim() && !isLoading && !isTyping
                ? `${uiConfig.buttonBg} text-white ${uiConfig.buttonHover}`
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
  )
}
