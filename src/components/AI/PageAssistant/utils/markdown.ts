/**
 * Markdown 渲染工具
 * 将 Markdown 格式文本转换为 HTML
 */

/**
 * 过滤掉 <think> 标签及其内容
 */
export function filterThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

/**
 * 渲染 Markdown 格式的文本
 */
export function renderMarkdown(text: string, isDark: boolean): string {
  let html = text
  
  // 处理代码块
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang || 'code'
    return `<div class="my-3 rounded-xl overflow-hidden ${isDark ? 'bg-zinc-900/80' : 'bg-gray-100'}">
      <div class="px-3 py-1.5 text-xs uppercase tracking-wider ${isDark ? 'text-zinc-500 bg-zinc-900' : 'text-gray-500 bg-gray-200/50'}">${langLabel}</div>
      <pre class="px-3 py-2 overflow-x-auto"><code class="text-xs md:text-sm font-mono ${isDark ? 'text-zinc-300' : 'text-gray-800'}">${code.trim()}</code></pre>
    </div>`
  })
  
  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded text-xs md:text-sm font-mono ${isDark ? 'bg-zinc-800 text-accent-green' : 'bg-gray-100 text-green-600'}">$1</code>`)
  
  // 处理加粗
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
  
  // 处理标题列表
  html = html.replace(/^(\d+)\.\s*\*\*([^*]+)\*\*/gm, '<div class="font-semibold mt-4 mb-2">$1. $2</div>')
  
  // 处理列表
  html = html.replace(/^-\s+(.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-accent-green mt-1">•</span><span>$1</span></div>')
  
  // 处理换行
  html = html.replace(/\n\n/g, '</p><p class="my-3">')
  html = html.replace(/\n/g, '<br/>')
  
  return `<p class="my-2">${html}</p>`
}
