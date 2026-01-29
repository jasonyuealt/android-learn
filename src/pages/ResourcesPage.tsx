import { useThemeBloc } from '../blocs/themeBloc'
import { ExternalLink, Book, Video, FileText, Github, Globe } from 'lucide-react'

/**
 * 资源中心页面
 */
export function ResourcesPage() {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 资源分类
  const resources = {
    official: [
      {
        title: 'Android 开发者官网',
        description: '官方文档、指南、API 参考，最权威的学习资源',
        url: 'https://developer.android.com',
        icon: 'Globe',
      },
      {
        title: 'Kotlin 官方文档',
        description: 'Kotlin 语言官方文档，包含教程和参考',
        url: 'https://kotlinlang.org/docs',
        icon: 'FileText',
      },
      {
        title: 'Jetpack Compose 文档',
        description: '现代 Android UI 开发框架官方指南',
        url: 'https://developer.android.com/jetpack/compose',
        icon: 'FileText',
      },
      {
        title: 'Android Codelabs',
        description: '官方实践教程，一步步学习 Android 开发',
        url: 'https://developer.android.com/codelabs',
        icon: 'Book',
      },
    ],
    github: [
      {
        title: 'Android Architecture Samples',
        description: 'Google 官方架构示例，学习最佳实践',
        url: 'https://github.com/android/architecture-samples',
        icon: 'Github',
      },
      {
        title: 'Compose Samples',
        description: 'Jetpack Compose 官方示例项目集合',
        url: 'https://github.com/android/compose-samples',
        icon: 'Github',
      },
      {
        title: 'Now in Android',
        description: 'Google 官方示范应用，展示现代 Android 开发',
        url: 'https://github.com/android/nowinandroid',
        icon: 'Github',
      },
      {
        title: 'Sunflower',
        description: 'Android Jetpack 最佳实践示例应用',
        url: 'https://github.com/android/sunflower',
        icon: 'Github',
      },
    ],
    videos: [
      {
        title: 'Android Developers YouTube',
        description: '官方 YouTube 频道，最新技术分享和教程',
        url: 'https://www.youtube.com/@AndroidDevelopers',
        icon: 'Video',
      },
      {
        title: 'Philipp Lackner',
        description: '高质量 Android 开发教程，覆盖 Compose、架构等',
        url: 'https://www.youtube.com/@PhilippLackner',
        icon: 'Video',
      },
      {
        title: 'Coding with Mitch',
        description: 'Android 实战项目教程，讲解细致',
        url: 'https://www.youtube.com/@codingwithmitch',
        icon: 'Video',
      },
    ],
    tools: [
      {
        title: 'Android Studio',
        description: '官方 IDE，Android 开发必备工具',
        url: 'https://developer.android.com/studio',
        icon: 'Globe',
      },
      {
        title: 'Firebase',
        description: 'Google 后端服务，认证、数据库、推送等',
        url: 'https://firebase.google.com',
        icon: 'Globe',
      },
      {
        title: 'Material Design',
        description: 'Google 设计规范，组件库和图标',
        url: 'https://m3.material.io',
        icon: 'Globe',
      },
    ],
  }

  // 获取图标组件
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Globe: <Globe size={20} />,
      FileText: <FileText size={20} />,
      Book: <Book size={20} />,
      Video: <Video size={20} />,
      Github: <Github size={20} />,
    }
    return icons[iconName] || <Globe size={20} />
  }

  // 渲染资源列表
  const renderResourceList = (items: typeof resources.official, title: string) => (
    <section className="mb-12">
      <h2 className="font-display text-xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 cursor-pointer
              ${isDark 
                ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-[#1c1c21]' 
                : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm hover:shadow-md'
              }
              group
            `}
          >
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-zinc-800/50' : 'bg-light-bg-secondary'} text-accent-blue`}>
              {getIcon(item.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{item.title}</h3>
                <ExternalLink size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} />
              </div>
              <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 lg:px-16 max-w-5xl mx-auto animate-fade-in-up">
      {/* 页面头部 */}
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">资源中心</h1>
        <p className={`text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          精选 Android 开发学习资源，助你快速成长
        </p>
      </header>

      {/* AI 提示 */}
      <div
        className={`
          p-6 rounded-2xl mb-12
          ${isDark 
            ? 'bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/20' 
            : 'bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/30'
          }
        `}
      >
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-xl">💡</span> AI 时代的学习建议
        </h3>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          在有 AI 辅助的今天，不需要记住所有 API 和语法细节。重点理解概念和架构，遇到具体问题时可以随时询问 AI。
          把时间花在理解"为什么"而不是"怎么写"上，这样才能在 AI 时代保持竞争力。
        </p>
      </div>

      {renderResourceList(resources.official, '📚 官方文档')}
      {renderResourceList(resources.github, '💻 开源项目')}
      {renderResourceList(resources.videos, '🎬 视频教程')}
      {renderResourceList(resources.tools, '🛠️ 开发工具')}
    </div>
  )
}
