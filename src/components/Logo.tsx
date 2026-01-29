/**
 * 统一的 Logo 组件
 * 用于导航栏、Kotlin 测试按钮等地方
 */
export function Logo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 机器人头部 */}
      <rect x="3" y="11" width="18" height="10" rx="2" />
      {/* 天线 */}
      <path d="M12 7V4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      {/* 眼睛 */}
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  )
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
      <Logo size={iconSize} className="text-dark-bg-primary" />
    </div>
  )
}
