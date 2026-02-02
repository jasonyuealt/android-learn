/**
 * Mermaid 渲染 Hook
 */

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export function useMermaidRender(
  isOpen: boolean,
  contentType: 'mermaid' | 'code',
  content: string,
  isDark: boolean
) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && contentType === 'mermaid' && containerRef.current) {
      const renderDiagram = async () => {
        try {
          const id = `mermaid-assistant-${Date.now()}`
          
          // 初始化Mermaid配置 - 与外面完全一致
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: isDark ? {
              // 暗黑模式 - 深色背景 + 绿色主题
              primaryColor: '#10b981',
              primaryTextColor: '#ffffff',
              primaryBorderColor: '#10b981',
              
              secondaryColor: '#1e40af',
              secondaryTextColor: '#ffffff',
              secondaryBorderColor: '#3b82f6',
              
              tertiaryColor: '#ea580c',
              tertiaryTextColor: '#ffffff',
              tertiaryBorderColor: '#f59e0b',
              
              background: '#09090b',
              mainBkg: '#18181b',
              secondBkg: '#27272a',
              
              lineColor: '#52525b',
              border1: '#3f3f46',
              border2: '#52525b',
              
              textColor: '#e4e4e7',
              nodeBorder: '#10b981',
              clusterBkg: '#18181b',
              clusterBorder: '#3f3f46',
              
              edgeLabelBackground: '#18181b',
              
              actorBorder: '#10b981',
              actorBkg: '#18181b',
              actorTextColor: '#e4e4e7',
              actorLineColor: '#52525b',
              signalColor: '#e4e4e7',
              signalTextColor: '#e4e4e7',
              labelBoxBkgColor: '#27272a',
              labelBoxBorderColor: '#3f3f46',
              labelTextColor: '#e4e4e7',
              loopTextColor: '#e4e4e7',
              noteBorderColor: '#f59e0b',
              noteBkgColor: '#422006',
              noteTextColor: '#fef3c7',
              activationBorderColor: '#10b981',
              activationBkgColor: '#064e3b',
              sequenceNumberColor: '#ffffff',
              
              fontSize: '14px'
            } : {
              // 明亮模式 - 浅色背景 + 绿色主题
              primaryColor: '#10b981',
              primaryTextColor: '#000000',
              primaryBorderColor: '#10b981',
              
              secondaryColor: '#3b82f6',
              secondaryTextColor: '#000000',
              secondaryBorderColor: '#3b82f6',
              
              tertiaryColor: '#f59e0b',
              tertiaryTextColor: '#000000',
              tertiaryBorderColor: '#f59e0b',
              
              background: '#ffffff',
              mainBkg: '#f9fafb',
              secondBkg: '#f3f4f6',
              
              lineColor: '#d1d5db',
              border1: '#e5e7eb',
              border2: '#d1d5db',
              
              textColor: '#1f2937',
              nodeBorder: '#10b981',
              clusterBkg: '#f9fafb',
              clusterBorder: '#e5e7eb',
              
              edgeLabelBackground: '#ffffff',
              
              actorBorder: '#10b981',
              actorBkg: '#f9fafb',
              actorTextColor: '#1f2937',
              actorLineColor: '#d1d5db',
              signalColor: '#1f2937',
              signalTextColor: '#1f2937',
              labelBoxBkgColor: '#f3f4f6',
              labelBoxBorderColor: '#e5e7eb',
              labelTextColor: '#1f2937',
              loopTextColor: '#1f2937',
              noteBorderColor: '#f59e0b',
              noteBkgColor: '#fef3c7',
              noteTextColor: '#92400e',
              activationBorderColor: '#10b981',
              activationBkgColor: '#d1fae5',
              sequenceNumberColor: '#ffffff',
              
              fontSize: '14px'
            }
          })
          
          const { svg } = await mermaid.render(id, content)
          
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        } catch (err) {
          console.error('Mermaid render error:', err)
        }
      }
      
      renderDiagram()
    }
  }, [isOpen, contentType, content, isDark])

  return { containerRef }
}
