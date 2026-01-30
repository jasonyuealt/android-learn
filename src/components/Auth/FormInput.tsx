/**
 * 表单输入框组件
 * 支持图标、不同样式
 */

import { ReactNode } from 'react'

interface FormInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  minLength?: number
  maxLength?: number
  icon?: ReactNode
  rightElement?: ReactNode
  error?: boolean
  errorMessage?: string
  isDark: boolean
  className?: string
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  icon,
  rightElement,
  error = false,
  errorMessage,
  isDark,
  className = ''
}: FormInputProps) {
  return (
    <div className={className}>
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          className={`
            w-full ${icon ? 'pl-12' : 'pl-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-3 sm:py-3.5 rounded-full text-base sm:text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent-green/30
            ${isDark 
              ? 'bg-[#141417] text-white placeholder:text-zinc-500 border-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] focus:shadow-[inset_0_0_0_1px_rgba(61,214,140,0.4)]' 
              : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-primary placeholder:text-light-text-muted focus:border-accent-green/50'
            }
            ${error ? 'shadow-[inset_0_0_0_1px_rgba(239,68,68,0.5)]' : ''}
          `}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
