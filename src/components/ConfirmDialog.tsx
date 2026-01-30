import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * 确认对话框组件
 * 符合项目整体设计风格
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false)
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 监听 isOpen 变化，控制动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 处理关闭动画
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onCancel()
    }, 200)
  }

  // 处理确认（不关闭对话框，由父组件控制）
  const handleConfirm = () => {
    onConfirm()
  }

  // 根据类型设置颜色
  const getTypeColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500'
      case 'warning':
        return 'text-amber-500'
      case 'info':
        return 'text-accent-blue'
      default:
        return 'text-amber-500'
    }
  }

  // 不渲染时返回 null
  if (!isOpen) {
    return null
  }

  // 使用 Portal 渲染到 body
  return createPortal(
    <div 
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
      
      {/* 对话框内容 */}
      <div 
        className={`
          relative w-full md:max-w-md mx-4
          overflow-hidden
          rounded-3xl shadow-2xl
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

        {/* 内容区域 */}
        <div className="p-6 md:p-8">
          {/* 图标 + 关闭按钮 */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
              ${type === 'danger' 
                ? 'bg-red-500/15' 
                : type === 'warning'
                  ? 'bg-amber-500/15'
                  : 'bg-accent-blue/15'
              }
            `}>
              <AlertTriangle size={24} className={getTypeColor()} />
            </div>
            <button
              onClick={handleClose}
              className={`
                -mt-2 -mr-2 p-2 rounded-full transition-colors duration-150 cursor-pointer
                ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-light-bg-secondary'}
              `}
            >
              <X size={20} />
            </button>
          </div>

          {/* 标题 */}
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            {title}
          </h3>

          {/* 消息 */}
          <p className={`text-sm md:text-base mb-6 ${isDark ? 'text-zinc-400' : 'text-light-text-secondary'}`}>
            {message}
          </p>

          {/* 按钮组 */}
          <div className="flex gap-3">
            {/* 取消按钮 */}
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={`
                flex-1 px-4 py-2.5 rounded-full text-sm font-medium
                transition-colors duration-150
                ${isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
                ${isDark 
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                  : 'bg-light-bg-secondary text-light-text-secondary hover:bg-light-bg-hover'
                }
              `}
            >
              {cancelText}
            </button>
            
            {/* 确认按钮 */}
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`
                flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-white
                transition-all duration-150
                flex items-center justify-center gap-2
                ${isLoading 
                  ? 'opacity-80 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
                ${type === 'danger'
                  ? 'bg-red-500 hover:bg-red-600'
                  : type === 'warning'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-accent-blue hover:bg-accent-blue/90'
                }
              `}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
