import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bot, LogOut, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useThemeBloc } from '../blocs/themeBloc'
import { useAuthBloc } from '../blocs/authBloc'

/**
 * 导航栏组件
 * 使用 React Router 实现导航，集成用户认证状态
 */
export function Navbar() {
  const theme = useThemeBloc((state) => state.theme)
  const { currentUser, logout } = useAuthBloc()
  const location = useLocation()
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  
  // 用户菜单下拉状态
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // 处理退出登录
  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  // 获取头像颜色
  const getAvatarColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'from-accent-green to-emerald-600',
      blue: 'from-accent-blue to-blue-600',
      orange: 'from-accent-orange to-orange-600',
      purple: 'from-accent-purple to-purple-600',
    }
    return colors[color] || colors.green
  }

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/learn', label: '学习' },
    { path: '/projects', label: '项目' },
    { path: '/resources', label: '资源' },
    { path: '/profile', label: '我的' },
  ]

  // 检查当前路径是否匹配
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-16 py-5
        flex items-center justify-between
        backdrop-blur-xl transition-colors duration-200
        ${isDark 
          ? 'bg-[#09090b]/90 border-b border-zinc-800/50' 
          : 'bg-light-bg-primary/80 border-b border-light-border-subtle'
        }
      `}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-lg shadow-accent-green/20">
          <Bot size={22} className="text-dark-bg-primary" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">
          Android Learn
        </span>
      </Link>

      {/* 导航链接 - 桌面端 */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-accent-green/50
              ${isActive(link.path)
                ? isDark
                  ? 'text-accent-green bg-dark-bg-card'
                  : 'text-accent-green bg-light-bg-card shadow-sm'
                : isDark
                  ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-card'
                  : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-card'
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {currentUser ? (
          // 已登录：显示用户头像和下拉菜单
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'hover:bg-dark-bg-card' 
                  : 'hover:bg-light-bg-card'
                }
              `}
            >
              {/* 头像 */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(currentUser.avatar)} flex items-center justify-center text-sm font-bold text-white`}>
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                {currentUser.username}
              </span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 下拉菜单 */}
            {isUserMenuOpen && (
              <>
                {/* 点击外部关闭 */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsUserMenuOpen(false)} 
                />
                <div
                  className={`
                    absolute right-0 top-full mt-2 w-48 rounded-xl py-2 z-50
                    ${isDark 
                      ? 'bg-[#141417] shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)]' 
                      : 'bg-light-bg-card border border-light-border-DEFAULT shadow-xl'
                    }
                  `}
                >
                  {/* 用户信息 */}
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-light-border-subtle'}`}>
                    <p className="font-medium text-sm truncate">{currentUser.username}</p>
                    <p className={`text-xs truncate ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                      {currentUser.email}
                    </p>
                  </div>
                  
                  {/* 菜单项 */}
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`
                      block px-4 py-2.5 text-sm transition-colors duration-200
                      ${isDark 
                        ? 'hover:bg-dark-bg-hover text-dark-text-secondary hover:text-dark-text-primary' 
                        : 'hover:bg-light-bg-hover text-light-text-secondary hover:text-light-text-primary'
                      }
                    `}
                  >
                    个人中心
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 cursor-pointer
                      flex items-center gap-2 text-red-500 hover:bg-red-500/10
                    `}
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          // 未登录：显示登录按钮
          <Link
            to="/login"
            className={`
              hidden sm:block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-green/50
              ${isDark
                ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-card'
                : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-card'
              }
            `}
          >
            登录
          </Link>
        )}
        
        <Link
          to="/learn"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent-green text-dark-bg-primary cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50"
        >
          开始学习
        </Link>
      </div>
    </nav>
  )
}
