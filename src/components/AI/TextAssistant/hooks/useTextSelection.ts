/**
 * 文本选择 Hook
 * 监听用户文本选择并显示 AI 分析按钮
 */

import { useState, useEffect } from 'react'

interface SelectionPosition {
  x: number
  y: number
}

export function useTextSelection(isOpen: boolean) {
  const [selectedText, setSelectedText] = useState('')
  const [buttonPosition, setButtonPosition] = useState<SelectionPosition>({ x: 0, y: 0 })
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleSelection = (e: MouseEvent | KeyboardEvent) => {
      if (isOpen) return
      
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-button]') || target.closest('[data-modal]')) return
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = range.commonAncestorContainer as HTMLElement
        const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container
        if (element?.closest('[data-modal]')) return
      }
      
      const text = selection?.toString().trim() || ''
      
      if (text.length > 2 && text.length < 500) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        
        if (rect) {
          const x = Math.max(60, Math.min(rect.left + rect.width / 2, window.innerWidth - 60))
          const y = Math.max(50, rect.top - 10)
          
          setSelectedText(text)
          setButtonPosition({ x, y })
          setShowButton(true)
        }
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-ai-button]')) return
      setShowButton(false)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    document.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isOpen])

  return {
    selectedText,
    buttonPosition,
    showButton,
    hideButton: () => setShowButton(false)
  }
}
