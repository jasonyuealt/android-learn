import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, Bot, ArrowLeft } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useAuthBloc } from '../blocs/authBloc'

/**
 * 登录页面
 */
export function LoginPage() {
  const theme = useThemeBloc((state) => state.theme)
  const { login, isLoading, error, clearError, currentUser } = useAuthBloc()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  // 表单状态
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // 如果已登录，跳转到个人中心
  useEffect(() => {
    if (currentUser) {
      navigate('/profile')
    }
  }, [currentUser, navigate])

  // 清除错误
  useEffect(() => {
    clearError()
  }, [])

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(emailOrUsername, password)
    if (success) {
      navigate('/profile')
    }
  }

  return (
    <div className="min-h-screen flex auth-page-transition overflow-x-hidden">
      {/* 左侧：装饰区域 */}
      <div className={`
        hidden lg:flex lg:w-1/2 relative overflow-hidden slide-in-left
        ${isDark 
          ? 'bg-gradient-to-br from-[#0c0c0f] via-accent-green/5 to-accent-blue/5' 
          : 'bg-gradient-to-br from-accent-green/10 via-accent-blue/5 to-light-bg-secondary'
        }
      `}>
        {/* 装饰圆圈 */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-accent-green/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent-blue/20 blur-3xl" />
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-lg shadow-accent-green/30">
              <Bot size={26} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Android Learn</span>
          </div>
          
          <h1 className="font-display text-4xl font-bold leading-tight mb-6">
            欢迎回来
            <br />
            <span className="text-gradient">继续你的学习之旅</span>
          </h1>
          
          <p className={`text-lg leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            在 AI 时代，专注于理解核心概念和架构思维。
            <br />
            系统化学习，从入门到进阶。
          </p>

          {/* 特性列表 */}
          <div className="mt-12 space-y-4">
            {[
              '记录学习进度，随时继续',
              '解锁成就徽章，见证成长',
              '本地数据存储，安全可靠',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent-green" />
                </div>
                <span className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧：登录表单 */}
      <div className={`
        w-full lg:w-1/2 flex justify-center px-4 sm:px-6 py-8 sm:py-12 slide-in-right
        ${isDark ? 'bg-[#09090b]' : 'bg-light-bg-primary'}
      `}>
        <div className="w-full max-w-md">
          {/* 返回按钮 */}
          <Link
            to="/"
            className={`
              inline-flex items-center gap-2 mb-6 sm:mb-8 text-sm transition-colors duration-200
              ${isDark 
                ? 'text-dark-text-secondary hover:text-dark-text-primary' 
                : 'text-light-text-secondary hover:text-light-text-primary'
              }
            `}
          >
            <ArrowLeft size={16} />
            返回首页
          </Link>

          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-lg shadow-accent-green/20">
              <Bot size={22} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl">Android Learn</span>
          </div>

          {/* 标题 */}
          <div className="mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">登录账户</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              输入你的账户信息继续学习
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* 邮箱或用户名 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                邮箱或用户名
              </label>
              <div className="relative">
                <Mail 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} 
                />
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="输入邮箱或用户名"
                  required
                  className={`
                    w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-full text-base sm:text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-accent-green/30
                    ${isDark 
                      ? 'bg-[#141417] text-white placeholder:text-zinc-500 border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[inset_0_0_0_1px_rgba(61,214,140,0.4)]' 
                      : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary placeholder:text-light-text-muted focus:border-accent-green/50'
                    }
                  `}
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                密码
              </label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  required
                  minLength={6}
                  className={`
                    w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-full text-base sm:text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-accent-green/30
                    ${isDark 
                      ? 'bg-[#141417] text-white placeholder:text-zinc-500 border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[inset_0_0_0_1px_rgba(61,214,140,0.4)]' 
                      : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary placeholder:text-light-text-muted focus:border-accent-green/50'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`
                    absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-200
                    ${isDark ? 'text-dark-text-muted hover:text-dark-text-primary' : 'text-light-text-muted hover:text-light-text-primary'}
                  `}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 sm:py-4 rounded-full text-base font-semibold transition-all duration-200 cursor-pointer
                flex items-center justify-center gap-2
                ${isLoading 
                  ? 'bg-accent-green/50 cursor-not-allowed' 
                  : 'bg-accent-green hover:shadow-lg hover:shadow-accent-green/25 hover:-translate-y-0.5'
                }
                text-dark-bg-primary
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* 分隔线 */}
          <div className="flex items-center gap-4 my-6 sm:my-8">
            <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-light-border-DEFAULT'}`} />
            <span className={`text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
              还没有账户？
            </span>
            <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-light-border-DEFAULT'}`} />
          </div>

          {/* 注册链接 */}
          <Link
            to="/register"
            className={`
              block w-full py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-center transition-all duration-200
              ${isDark 
                ? 'bg-[#141417] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-[#1c1c21]' 
                : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary hover:bg-light-bg-hover'
              }
            `}
          >
            创建新账户
          </Link>
        </div>
      </div>
    </div>
  )
}
