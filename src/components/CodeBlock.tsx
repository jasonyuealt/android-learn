import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'

interface CodeBlockProps {
  code: string
  language?: string
}

/**
 * 代码块组件
 * 带复制按钮和复制成功反馈
 */
export function CodeBlock({ code, language = 'code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
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
      <pre className="p-4 overflow-x-auto">
        <code className={`font-mono text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
