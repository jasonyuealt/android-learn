import { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { ContentAssistant } from './AI/ContentAssistant'

interface CodeBlockProps {
  code: string
  language?: string
}

/**
 * 代码块组件
 * 带复制按钮和复制成功反馈，支持AI解析（5行以上代码）
 */
export function CodeBlock({ code, language = 'code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  // 判断是否显示AI解析按钮（5行以上代码）
  const shouldShowAI = code.trim().split('\n').length >= 5

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div
        className={`
          rounded-3xl overflow-hidden my-6
          ${isDark ? 'bg-[#0c0c0f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-secondary border border-light-border-DEFAULT'}
        `}
      >
        <div className={`flex justify-between items-center px-4 py-2 border-b ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
          <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
            {language}
          </span>
          <div className="flex items-center gap-2">
            {/* PC端：AI解析按钮（仅长代码显示） */}
            {shouldShowAI && (
              <button
                onClick={() => setShowAssistant(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer
                           bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue"
                title="AI讲解代码"
              >
                <Sparkles size={12} /> AI解析
              </button>
            )}
            {/* 复制按钮 */}
            <button
              onClick={handleCopy}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer
                ${copied
                  ? 'bg-accent-green/20 text-accent-green'
                  : isDark
                    ? 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-secondary hover:text-light-text-primary'
                }
              `}
            >
              {copied ? (
                <>
                  <Check size={12} />
                  已复制
                </>
              ) : (
                <>
                  <Copy size={12} />
                  复制
                </>
              )}
            </button>
          </div>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className={`font-mono text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {code}
          </code>
        </pre>
      </div>
      
      {/* 移动端：下方AI解析按钮（仅长代码显示） */}
      {shouldShowAI && (
        <button
          onClick={() => setShowAssistant(true)}
          className="flex md:hidden w-full -mt-3 mb-6 py-2.5 items-center justify-center gap-2 rounded-lg
                     bg-accent-blue/10 hover:bg-accent-blue/15 active:bg-accent-blue/20 text-accent-blue 
                     text-sm font-medium transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={14} /> AI讲解这段代码
        </button>
      )}
      
      {/* AI助手组件 */}
      <ContentAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        contentType="code"
        content={code}
        language={language}
        isDark={isDark}
      />
    </>
  )
}
