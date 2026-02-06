import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Code } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { getProjectById } from '../data/projects'
import { Icon } from '../components/Icon'

/**
 * 项目详情页面
 */
export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  const project = projectId ? getProjectById(projectId) : null

  if (!project) {
    return (
      <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">项目未找到</h1>
        <Link to="/projects" className="text-accent-green hover:underline">
          返回项目列表
        </Link>
      </div>
    )
  }

  // 难度标签
  const getDifficultyLabel = (level: number) => {
    const labels = ['入门', '进阶', '中级', '高级', '专家']
    return labels[level - 1] || ''
  }

  return (
    <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-4xl mx-auto animate-fade-in-up">
      {/* 返回链接 */}
      <Link
        to="/projects"
        className={`
          inline-flex items-center gap-2 mb-8 text-sm transition-colors cursor-pointer
          ${isDark ? 'text-dark-text-muted hover:text-dark-text-primary' : 'text-light-text-muted hover:text-light-text-primary'}
        `}
      >
        <ArrowLeft size={16} />
        返回项目列表
      </Link>

      {/* 项目头部 */}
      <header className="mb-12">
        <div className="flex items-start gap-6 mb-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${isDark ? 'bg-dark-bg-card' : 'bg-light-bg-secondary'}`}>
            <Icon name={project.iconName} size={40} className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs bg-accent-orange/15 text-accent-orange font-medium">
                Lv.{project.difficulty} {getDifficultyLabel(project.difficulty)}
              </span>
              <span className={`flex items-center gap-1 text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                <Clock size={14} />
                预计 {project.estimatedHours} 小时
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">{project.name}</h1>
            <p className={`text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              {project.description}
            </p>
          </div>
        </div>

        {/* 技术标签 */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`
                px-3 py-1.5 rounded-full text-sm
                ${isDark ? 'bg-dark-bg-card text-dark-text-secondary' : 'bg-light-bg-secondary text-light-text-secondary'}
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* 项目概述 */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-4">项目概述</h2>
        <p className={`leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          {project.overview}
        </p>
      </section>

      {/* 功能列表 */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-4">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {project.features.map((feature, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-3xl
                ${isDark ? 'bg-dark-bg-card' : 'bg-light-bg-secondary'}
              `}
            >
              <CheckCircle size={18} className="text-accent-green flex-shrink-0" />
              <span className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 技术栈 */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-4">技术栈</h2>
        <div className="flex flex-wrap gap-3">
          {project.techStack.map((tech, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-card border border-light-border-DEFAULT'}
              `}
            >
              <Code size={16} className="text-accent-blue" />
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 开发步骤 */}
      {project.steps.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold mb-6">开发步骤</h2>
          <div className="space-y-6">
            {project.steps.map((step, index) => (
              <div
                key={index}
                className={`
                  rounded-3xl overflow-hidden
                  ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-card border border-light-border-DEFAULT shadow-sm'}
                `}
              >
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-green/15 text-accent-green flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {step.code && (
                  <div className={`border-t ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
                    <pre className="p-4 overflow-x-auto">
                      <code className={`font-mono text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        {step.code}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 开始按钮 */}
      <div className="flex justify-center">
        <Link
          to="/learn"
          className={`px-8 py-4 rounded-full text-base font-semibold bg-accent-green ${isDark ? 'text-dark-bg-primary' : 'text-white'} cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50`}
        >
          先学习基础知识
        </Link>
      </div>
    </div>
  )
}
