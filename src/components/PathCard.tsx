import { useThemeBloc } from '../blocs/themeBloc'
import { Icon } from './Icon'
import type { LearningPhase } from '../types'

interface PathCardProps {
  phase: LearningPhase
  index: number
}

/**
 * 学习路径卡片组件
 * 使用 Lucide 图标替代 Emoji
 */
export function PathCard({ phase, index }: PathCardProps) {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 根据颜色类型获取图标颜色
  const getIconColor = () => {
    const colors = {
      green: 'text-accent-green',
      blue: 'text-accent-blue',
      orange: 'text-accent-orange',
      purple: 'text-accent-purple',
    }
    return colors[phase.colorType]
  }

  // 根据颜色类型获取背景色
  const getIconBg = () => {
    const colors = {
      green: 'bg-accent-green/15',
      blue: 'bg-accent-blue/15',
      orange: 'bg-accent-orange/15',
      purple: 'bg-accent-purple/15',
    }
    return colors[phase.colorType]
  }

  return (
    <div
      className={`
        relative rounded-2xl p-6 cursor-pointer transition-all duration-200
        ${isDark 
          ? 'bg-[#141417] hover:bg-[#1c1c21] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]' 
          : 'bg-light-bg-card hover:bg-light-bg-hover shadow-sm hover:shadow-lg'
        }
        hover:-translate-y-1
        group
        focus:outline-none focus:ring-2 focus:ring-accent-green/50
      `}
      tabIndex={0}
      role="button"
      aria-label={`学习阶段：${phase.name}，进度 ${phase.progress}%`}
    >

      {/* 图标 - 使用 Lucide 图标 */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${getIconBg()}`}>
        <Icon name={phase.iconName} size={24} className={getIconColor()} />
      </div>

      {/* 阶段标签 */}
      <div className={`text-xs uppercase tracking-widest mb-2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
        阶段 {index + 1}
      </div>

      {/* 标题 */}
      <h3 className="text-lg font-semibold mb-2">{phase.name}</h3>

      {/* 描述 */}
      <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
        {phase.description}
      </p>

      {/* 进度条 */}
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-1 rounded-full overflow-hidden ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-secondary'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-500"
            style={{ width: `${phase.progress}%` }}
            role="progressbar"
            aria-valuenow={phase.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className={`text-xs font-mono ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          {phase.progress}%
        </span>
      </div>
    </div>
  )
}
