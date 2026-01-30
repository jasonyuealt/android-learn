/**
 * 密码输入框组件
 * 带显示/隐藏功能
 */

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  minLength?: number
  error?: boolean
  errorMessage?: string
  showStrength?: boolean
  isDark: boolean
  className?: string
}

/**
 * 密码强度检查
 */
function getPasswordStrength(password: string) {
  if (password.length === 0) return null
  if (password.length < 6) return { level: 1, text: '太短', color: 'bg-red-500' }
  if (password.length < 8) return { level: 2, text: '一般', color: 'bg-yellow-500' }
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return { level: 3, text: '强', color: 'bg-accent-green' }
  }
  return { level: 2, text: '中等', color: 'bg-accent-blue' }
}

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  minLength = 6,
  error = false,
  errorMessage,
  showStrength = false,
  isDark,
  className = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const passwordStrength = showStrength ? getPasswordStrength(value) : null

  return (
    <div className={className}>
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
        {label}
      </label>
      <div className="relative">
        <Lock 
          size={18} 
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`} 
        />
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`
            w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-full text-base sm:text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent-green/30
            ${isDark 
              ? 'bg-[#141417] text-white placeholder:text-zinc-500 border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[inset_0_0_0_1px_rgba(61,214,140,0.4)]' 
              : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary placeholder:text-light-text-muted focus:border-accent-green/50'
            }
            ${error ? 'shadow-[inset_0_0_0_1px_rgba(239,68,68,0.5)]' : ''}
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
      
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
