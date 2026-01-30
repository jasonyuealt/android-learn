/**
 * 注册页面
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Loader2, User, CheckCircle } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useAuthBloc } from '../blocs/authBloc'
import { AuthLayout } from '../components/Auth/AuthLayout'
import { AuthDecorationPanel } from '../components/Auth/AuthDecorationPanel'
import { FormInput } from '../components/Auth/FormInput'
import { PasswordInput } from '../components/Auth/PasswordInput'

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

  // 学习内容列表
  const learningFeatures = [
    { text: 'Kotlin 语言基础', done: true },
    { text: 'Android 核心组件', done: true },
    { text: 'Jetpack Compose UI', done: true },
    { text: '网络与数据存储', done: false },
    { text: '架构设计与最佳实践', done: false }
  ]

  return (
    <div className="min-h-screen flex auth-page-transition overflow-x-hidden">
      {/* 左侧：装饰区域 */}
      <AuthDecorationPanel
        title="开始学习"
        subtitle="成为 Android 开发者"
        description="加入我们，系统化学习 Android 开发。从零基础到独立开发完整应用。"
        features={learningFeatures.map(item => ({
          text: item.text,
          done: item.done,
          icon: (
            <CheckCircle 
              size={20} 
              className={item.done ? 'text-accent-green' : isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} 
            />
          )
        }))}
        isDark={isDark}
      />

      {/* 右侧：注册表单 */}
      <AuthLayout
        title="创建账户"
        subtitle="填写信息开始你的学习之旅"
        isDark={isDark}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* 用户名 */}
          <FormInput
            label="用户名"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="输入用户名（2-20个字符）"
            required
            minLength={2}
            maxLength={20}
            icon={<User size={18} />}
            isDark={isDark}
          />

          {/* 邮箱 */}
          <FormInput
            label="邮箱"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="输入邮箱地址"
            required
            icon={<Mail size={18} />}
            isDark={isDark}
          />

          {/* 密码 */}
          <PasswordInput
            label="密码"
            value={password}
            onChange={setPassword}
            placeholder="输入密码（至少6个字符）"
            required
            minLength={6}
            showStrength
            isDark={isDark}
          />

          {/* 确认密码 */}
          <PasswordInput
            label="确认密码"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="再次输入密码"
            required
            minLength={6}
            error={confirmPassword !== '' && password !== confirmPassword}
            errorMessage={confirmPassword !== '' && password !== confirmPassword ? '密码不匹配' : undefined}
            isDark={isDark}
          />

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
      </AuthLayout>
    </div>
  )
}
