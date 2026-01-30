/**
 * 认证页面布局
 * 提供左右分栏结构
 */

import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Bot, ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  isDark: boolean
}

export function AuthLayout({ children, title, subtitle, isDark }: AuthLayoutProps) {
  return (
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
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
          <p className={`text-sm sm:text-base ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {subtitle}
          </p>
        </div>

        {/* 表单内容 */}
        {children}
      </div>
    </div>
  )
}
