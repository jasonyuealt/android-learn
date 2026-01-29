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
    <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-7xl mx-auto animate-fade-in-up">
      {/* 页面头部 */}
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">实战项目</h1>
        <p className={`text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          从简单到复杂，循序渐进提升实战技能
        </p>
      </header>

      {/* 项目网格 - 与学习路径卡片风格统一 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projectsData.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className={`
              relative rounded-3xl p-6 cursor-pointer transition-all duration-200
              ${isDark 
                ? 'bg-[#141417] hover:bg-[#1c1c21] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]' 
                : 'bg-light-bg-card hover:bg-light-bg-hover shadow-sm hover:shadow-lg'
              }
              hover:-translate-y-1
              group
              focus:outline-none focus:ring-2 focus:ring-accent-green/50
            `}
          >
            {/* 图标 */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-accent-orange/15">
              <Icon name={project.iconName} size={24} className="text-accent-orange" />
            </div>

            {/* 难度和时间 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-xs bg-accent-orange/15 text-accent-orange font-medium">
                Lv.{project.difficulty}
              </span>
              <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                {getDifficultyLabel(project.difficulty)}
              </span>
              <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-light-text-muted'}`}>·</span>
              <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                <Clock size={12} />
                {project.estimatedHours}h
              </span>
            </div>

            {/* 标题 */}
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>

            {/* 描述 */}
            <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              {project.description}
            </p>

            {/* 技术标签 */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${isDark ? 'bg-zinc-800/50 text-dark-text-muted' : 'bg-light-bg-secondary text-light-text-muted'}
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
