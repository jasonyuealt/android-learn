import { Link, useLocation } from 'react-router-dom'
import { useThemeBloc } from '../blocs/themeBloc'

/**
 * 底部导航组件
 * 使用 React Router 实现导航
 */
export function BottomNav() {
  const theme = useThemeBloc((state) => state.theme)
  const location = useLocation()
  const isDark = theme === 'dark'

  const tabs = [
    { path: '/', label: '首页' },
    { path: '/learn', label: '学习' },
    { path: '/projects', label: '项目' },
    { path: '/profile', label: '我的' },
  ]

  // 检查当前路径是否匹配
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex gap-2 p-2 rounded-full
        backdrop-blur-xl shadow-2xl
        ${isDark 
          ? 'bg-[#141417]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.5)]' 
          : 'bg-light-bg-card/90 border border-light-border-DEFAULT'
        }
      `}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`
            px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-accent-green/50
            ${isActive(tab.path)
              ? 'bg-accent-green text-dark-bg-primary'
              : isDark
                ? 'text-dark-text-secondary hover:text-dark-text-primary'
                : 'text-light-text-secondary hover:text-light-text-primary'
            }
          `}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
