/**
 * ContentAssistant 类型定义
 */

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ContentAssistantProps {
  isOpen: boolean
  onClose: () => void
  contentType: 'mermaid' | 'code'
  content: string
  language?: string
  isDark: boolean
}

export interface UIConfig {
  title: string
  subtitle: string
  iconBg: string
  iconColor: string
  ringColor: string
  buttonBg: string
  buttonHover: string
  cursorColor: string
}
