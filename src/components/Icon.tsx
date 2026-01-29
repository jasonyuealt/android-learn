import {
  Smartphone,
  Puzzle,
  Globe,
  Building2,
  Rocket,
  CheckSquare,
  CloudSun,
  Newspaper,
  MessageCircle,
  Target,
  Flame,
  Trophy,
  Star,
  Gem,
  Medal,
  Crown,
  Music,
  Camera,
  ShoppingCart,
  Gamepad2,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'

/**
 * 图标名称到组件的映射
 */
const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Puzzle,
  Globe,
  Building2,
  Rocket,
  CheckSquare,
  CloudSun,
  Newspaper,
  MessageCircle,
  Target,
  Flame,
  Trophy,
  Star,
  Gem,
  Medal,
  Crown,
  Music,
  Camera,
  ShoppingCart,
  Gamepad2,
  BookOpen,
}

interface IconProps {
  name: string
  size?: number
  className?: string
}

/**
 * 图标组件
 * 根据名称动态渲染 Lucide 图标
 */
export function Icon({ name, size = 24, className = '' }: IconProps) {
  const IconComponent = iconMap[name]

  if (!IconComponent) {
    // 如果找不到图标，返回一个默认占位符
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs">?</span>
      </div>
    )
  }

  return <IconComponent size={size} className={className} />
}
