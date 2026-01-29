import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, Bot, ArrowLeft, User, CheckCircle } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useAuthBloc } from '../blocs/authBloc'

/**
 * 注册页面
 */
export function RegisterPage() {
  const theme = useThemeBloc((state) => state.theme)
  const { register, isLoading, error, clearError, currentUser } = useAuthBloc()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  // 表单状态
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

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

  // 密码强度检查
  const getPasswordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 6) return { level: 1, text: '太短', color: 'bg-red-500' }
    if (password.length < 8) return { level: 2, text: '一般', color: 'bg-yellow-500' }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 3, text: '强', color: 'bg-accent-green' }
    }
    return { level: 2, text: '中等', color: 'bg-accent-blue' }
  }

  const passwordStrength = getPasswordStrength()

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // 验证密码匹配
    if (password !== confirmPassword) {
      setLocalError('两次输入的密码不一致')
      return
    }

    const success = await register(username, email, password)
    if (success) {
      navigate('/profile')
    }
  }

  // 显示的错误
  const displayError = localError || error

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
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent-green/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-accent-blue/20 blur-3xl" />
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-lg shadow-accent-green/30">
              <Bot size={26} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Android Learn</span>
          </div>
          
          <h1 className="font-display text-4xl font-bold leading-tight mb-6">
            开始学习
            <br />
            <span className="text-gradient">成为 Android 开发者</span>
          </h1>
          
          <p className={`text-lg leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            加入我们，系统化学习 Android 开发。
            <br />
            从零基础到独立开发完整应用。
          </p>

          {/* 学习内容预览 */}
          <div className="mt-12 space-y-4">
            {[
              { text: 'Kotlin 语言基础', done: true },
              { text: 'Android 核心组件', done: true },
              { text: 'Jetpack Compose UI', done: true },
              { text: '网络与数据存储', done: false },
              { text: '架构设计与最佳实践', done: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle 
                  size={20} 
                  className={item.done ? 'text-accent-green' : isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} 
                />
                <span className={`
                  ${item.done 
                    ? '' 
                    : isDark ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }
                `}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧：注册表单 */}
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
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">创建账户</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              填写信息开始你的学习之旅
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* 用户名 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                用户名
              </label>
              <div className="relative">
                <User 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} 
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名（2-20个字符）"
                  required
                  minLength={2}
                  maxLength={20}
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

            {/* 邮箱 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                邮箱
              </label>
              <div className="relative">
                <Mail 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱地址"
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
                  placeholder="输入密码（至少6个字符）"
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
              {/* 密码强度指示器 */}
              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-dark-bg-secondary overflow-hidden flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`
                          flex-1 h-full rounded-full transition-colors duration-200
                          ${level <= passwordStrength.level ? passwordStrength.color : ''}
                        `}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            {/* 确认密码 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                确认密码
              </label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  required
                  minLength={6}
                  className={`
                    w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-full text-base sm:text-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-accent-green/30
                    ${isDark 
                      ? 'bg-[#141417] text-white placeholder:text-zinc-500 border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[inset_0_0_0_1px_rgba(61,214,140,0.4)]' 
                      : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary placeholder:text-light-text-muted focus:border-accent-green/50'
                    }
                    ${confirmPassword && password !== confirmPassword ? 'shadow-[inset_0_0_0_1px_rgba(239,68,68,0.5)]' : ''}
                  `}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">密码不匹配</p>
              )}
            </div>

            {/* 错误提示 */}
            {displayError && (
              <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {displayError}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading || (confirmPassword !== '' && password !== confirmPassword)}
              className={`
                w-full py-3.5 sm:py-4 rounded-full text-base font-semibold transition-all duration-200 cursor-pointer
                flex items-center justify-center gap-2
                ${isLoading || (confirmPassword !== '' && password !== confirmPassword)
                  ? 'bg-accent-green/50 cursor-not-allowed' 
                  : 'bg-accent-green hover:shadow-lg hover:shadow-accent-green/25 hover:-translate-y-0.5'
                }
                text-dark-bg-primary
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  注册中...
                </>
              ) : (
                '创建账户'
              )}
            </button>
          </form>

          {/* 分隔线 */}
          <div className="flex items-center gap-4 my-6 sm:my-8">
            <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-light-border-DEFAULT'}`} />
            <span className={`text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
              已有账户？
            </span>
            <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-light-border-DEFAULT'}`} />
          </div>

          {/* 登录链接 */}
          <Link
            to="/login"
            className={`
              block w-full py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-center transition-all duration-200
              ${isDark 
                ? 'bg-[#141417] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-[#1c1c21]' 
                : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary hover:bg-light-bg-hover'
              }
            `}
          >
            登录已有账户
          </Link>
        </div>
      </div>
    </div>
  )
}
