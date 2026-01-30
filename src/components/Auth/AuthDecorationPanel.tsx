/**
 * 认证页面装饰面板
 * 左侧展示区域
 */

import { ReactNode } from 'react'
import { Bot } from 'lucide-react'

interface AuthDecorationPanelProps {
  title: string
  subtitle: string
  description: string
  features: Array<{ text: string; icon?: ReactNode; done?: boolean }>
  isDark: boolean
}

export function AuthDecorationPanel({
  title,
  subtitle,
  description,
  features,
  isDark
}: AuthDecorationPanelProps) {
  return (
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
          {title}
          <br />
          <span className="text-gradient">{subtitle}</span>
        </h1>
        
        <p className={`text-lg leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          {description}
        </p>

        {/* 特性列表 */}
        <div className="mt-12 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              {feature.icon || (
                <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent-green" />
                </div>
              )}
              <span className={`
                ${feature.done === false 
                  ? isDark ? 'text-dark-text-muted' : 'text-light-text-muted' 
                  : isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }
              `}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
