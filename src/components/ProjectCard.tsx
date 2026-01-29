import { useThemeBloc } from '../blocs/themeBloc'
import { Icon } from './Icon'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  index: number
}

/**
 * 项目卡片组件
 * 使用 Lucide 图标替代 Emoji
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 生成难度星标 - 使用 Lucide Star 图标
  const renderDifficulty = () => {
    const labels = ['入门', '进阶', '中级', '高级', '专家']
    return labels[project.difficulty - 1] || ''
  }

  return (
    <div
      className={`
        rounded-3xl overflow-hidden cursor-pointer transition-all duration-200
        ${isDark 
          ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]' 
          : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm hover:shadow-xl'
        }
        hover:-translate-y-1.5
        group
        focus:outline-none focus:ring-2 focus:ring-accent-green/50
      `}
      tabIndex={0}
      role="button"
      aria-label={`项目：${project.name}，难度：${renderDifficulty()}`}
    >
      {/* 预览区域 - 使用 Lucide 图标 */}
      <div
        className={`
          h-40 flex items-center justify-center relative overflow-hidden
          ${isDark ? 'bg-[#0f0f12]' : 'bg-light-bg-secondary'}
        `}
      >
        <div className="group-hover:scale-110 transition-transform duration-200">
          <Icon 
            name={project.iconName} 
            size={48} 
            className={isDark ? 'text-zinc-600' : 'text-light-text-secondary'} 
          />
        </div>
        {/* 底部渐变遮罩 */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-16
            ${isDark 
              ? 'bg-gradient-to-t from-[#141417] to-transparent' 
              : 'bg-gradient-to-t from-light-bg-card to-transparent'
            }
          `}
        />
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* 难度标签 - 使用文字代替星星 Emoji */}
          <span className="px-2.5 py-1 rounded-full text-xs bg-accent-orange/15 text-accent-orange font-medium">
            Lv.{project.difficulty} {renderDifficulty()}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`
                px-2.5 py-1 rounded-full text-xs
                ${isDark ? 'bg-dark-bg-secondary text-dark-text-secondary' : 'bg-light-bg-secondary text-light-text-secondary'}
              `}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>

        {/* 描述 */}
        <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          {project.description}
        </p>
      </div>
    </div>
  )
}
