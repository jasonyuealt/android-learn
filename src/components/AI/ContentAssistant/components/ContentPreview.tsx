/**
 * 内容预览组件
 * 左侧显示Mermaid流程图或代码
 */

import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useMermaidRender } from '../hooks/useMermaidRender'

interface ContentPreviewProps {
  contentType: 'mermaid' | 'code'
  content: string
  language: string
  isDark: boolean
  isOpen: boolean
}

export function ContentPreview({ 
  contentType, 
  content, 
  language, 
  isDark, 
  isOpen 
}: ContentPreviewProps) {
  const [scale, setScale] = useState(1)
  const [isPinching, setIsPinching] = useState(false)
  const mermaidScrollRef = useRef<HTMLDivElement>(null)
  const lastDistanceRef = useRef<number>(0)
  
  const { containerRef: mermaidContainerRef } = useMermaidRender(isOpen, contentType, content, isDark)

  // 缩放控制
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.3))
  const handleResetZoom = () => setScale(1)

  // 鼠标滚轮缩放
  useEffect(() => {
    const container = mermaidScrollRef.current
    if (!container || contentType !== 'mermaid') return

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = -e.deltaY * 0.001
        setScale(prev => Math.min(Math.max(prev + delta, 0.3), 3))
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [contentType])

  // 触摸捏合缩放
  useEffect(() => {
    const container = mermaidScrollRef.current
    if (!container || contentType !== 'mermaid') return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        e.stopPropagation()
        setIsPinching(true)
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
        lastDistanceRef.current = distance
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        e.stopPropagation()
        if (isPinching) {
          const touch1 = e.touches[0]
          const touch2 = e.touches[1]
          const distance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          )
          
          // 大幅增加缩放灵敏度
          // 双指距离变化10%，缩放变化30%（3倍放大）
          const ratio = distance / lastDistanceRef.current
          const amplifiedRatio = 1 + (ratio - 1) * 3
          setScale(prev => Math.min(Math.max(prev * amplifiedRatio, 0.3), 3))
          lastDistanceRef.current = distance
        }
      }
    }

    const handleTouchEnd = () => {
      setIsPinching(false)
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [contentType, isPinching])

  // 重置缩放
  useEffect(() => {
    if (isOpen) {
      setScale(1)
    }
  }, [isOpen])

  return (
    <div className={`
      md:w-2/5 md:border-r shrink-0 flex flex-col
      ${isDark ? 'md:border-zinc-800' : 'md:border-light-border-DEFAULT'}
    `}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              {contentType === 'mermaid' ? '流程图' : '代码'}
            </span>
            {contentType === 'mermaid' && (
              <span className={`hidden md:inline text-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                (Ctrl+滚轮)
              </span>
            )}
          </div>
          {contentType === 'mermaid' && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.3}
                className={`p-1.5 rounded transition-colors ${
                  scale <= 0.3
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                      ? 'hover:bg-zinc-800 text-zinc-400'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="缩小"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={handleResetZoom}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  isDark
                    ? 'hover:bg-zinc-800 text-zinc-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="重置"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 3}
                className={`p-1.5 rounded transition-colors ${
                  scale >= 3
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                      ? 'hover:bg-zinc-800 text-zinc-400'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="放大"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          )}
        </div>
        
        {/* Mermaid 流程图渲染 */}
        {contentType === 'mermaid' ? (
          <div 
            ref={mermaidScrollRef}
            className="flex-1 overflow-auto"
            style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
          >
            <div
              ref={mermaidContainerRef}
              className={`inline-block transition-transform duration-100 ${
                isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-white border border-light-border-subtle shadow-sm'
              } rounded-lg p-4`}
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
          </div>
        ) : (
          /* 代码块渲染 */
          <div className="flex-1 overflow-auto">
            <div className={`
              rounded-lg overflow-hidden
              ${isDark ? 'bg-[#0c0c0f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-secondary border border-light-border-DEFAULT'}
            `}>
              <div className={`flex justify-between items-center px-4 py-2 border-b ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
                <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                  {language}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
                <code className={`font-mono ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {content}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
