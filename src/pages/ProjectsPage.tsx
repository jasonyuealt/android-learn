import { Link } from 'react-router-dom'
import { useThemeBloc } from '../blocs/themeBloc'
import { projectsData } from '../data/projects'
import { Icon } from '../components/Icon'
import { Clock } from 'lucide-react'

/**
 * 项目列表页面
 */
export function ProjectsPage() {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 渲染难度标签
  const getDifficultyLabel = (level: number) => {
    const labels = ['入门', '进阶', '中级', '高级', '专家']
    return labels[level - 1] || ''
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto animate-fade-in-up">
      {/* 页面头部 */}
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">实战项目</h1>
        <p className={`text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          从简单到复杂，循序渐进提升实战技能
        </p>
      </header>

      {/* 项目网格 - 移除卡片动画，只保留 hover 效果 (UX 指南第7条) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projectsData.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className={`
              rounded-2xl overflow-hidden cursor-pointer transition-all duration-200
              ${isDark 
                ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]' 
                : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm hover:shadow-xl'
              }
              hover:-translate-y-1.5
              group
              focus:outline-none focus:ring-2 focus:ring-accent-green/50
            `}
          >
            {/* 预览区域 */}
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
              {/* 底部渐变 */}
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
                <span className="px-2.5 py-1 rounded-full text-xs bg-accent-orange/15 text-accent-orange font-medium">
                  Lv.{project.difficulty} {getDifficultyLabel(project.difficulty)}
                </span>
              </div>

              {/* 标题 */}
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>

              {/* 描述 */}
              <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {project.description}
              </p>

              {/* 预计时间 */}
              <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                <Clock size={14} />
                预计 {project.estimatedHours} 小时
              </div>

              {/* 技术标签 */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`
                      px-2 py-0.5 rounded text-xs
                      ${isDark ? 'bg-dark-bg-secondary text-dark-text-muted' : 'bg-light-bg-secondary text-light-text-muted'}
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
