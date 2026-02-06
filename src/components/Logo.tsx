import { Bot } from 'lucide-react'

/**
 * 统一的 Logo 组件
 * 用于导航栏、Kotlin 测试按钮等地方
 * 使用 Lucide Bot 图标
 */
export function Logo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <Bot size={size} className={className} />
}

/**
 * 带背景的 Logo（用于浮动按钮等）
 */
export function LogoWithBackground({ 
  size = 40, 
  iconSize = 22,
  className = '' 
}: { 
  size?: number
  iconSize?: number
  className?: string 
}) {
  return (
    <div 
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 ${className}`}
      style={{ width: size, height: size }}
    >
      <Logo size={iconSize} className="text-white" />
    </div>
  )
}
