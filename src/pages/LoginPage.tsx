/**
 * 登录页面
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Loader2 } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useAuthBloc } from '../blocs/authBloc'
import { AuthLayout } from '../components/Auth/AuthLayout'
import { AuthDecorationPanel } from '../components/Auth/AuthDecorationPanel'
import { FormInput } from '../components/Auth/FormInput'
import { PasswordInput } from '../components/Auth/PasswordInput'

export function LoginPage() {
  const theme = useThemeBloc((state) => state.theme)
  const { login, isLoading, error, clearError, currentUser } = useAuthBloc()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  // 表单状态
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    const success = await login(email, password)
    if (success) {
      navigate('/profile')
    }
  }

  return (
    <div className="min-h-screen flex auth-page-transition overflow-x-hidden">
      {/* 左侧：装饰区域 */}
      <AuthDecorationPanel
        title="欢迎回来"
        subtitle="继续你的学习之旅"
        description="在 AI 时代，专注于理解核心概念和架构思维。系统化学习，从入门到进阶。"
        features={[
          { text: '记录学习进度，随时继续' },
          { text: '解锁成就徽章，见证成长' },
          { text: '本地数据存储，安全可靠' }
        ]}
        isDark={isDark}
      />

      {/* 右侧：登录表单 */}
      <AuthLayout
        title="登录账户"
        subtitle="输入你的账户信息继续学习"
        isDark={isDark}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* 邮箱 */}
          <FormInput
            label="邮箱"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="输入你的邮箱"
            required
            icon={<Mail size={18} />}
            isDark={isDark}
          />

          {/* 密码 */}
          <PasswordInput
            label="密码"
            value={password}
            onChange={setPassword}
            placeholder="输入密码"
            required
            minLength={6}
            isDark={isDark}
          />

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
              ${isDark ? 'text-dark-bg-primary' : 'text-white'}
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
      </AuthLayout>
    </div>
  )
}
