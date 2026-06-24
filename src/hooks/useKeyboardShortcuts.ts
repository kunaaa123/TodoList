import { useEffect } from 'react'
import { useDoneDayStore } from '../store/useDoneDayStore'

export const useKeyboardShortcuts = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setCreateTaskModalOpen,
    isCreateTaskModalOpen,
    selectedTaskId,
    setSelectedTaskId,
  } = useDoneDayStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid triggering when user is typing in inputs or textareas
      const activeEl = document.activeElement
      const isTyping =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.getAttribute('contenteditable') === 'true'

      if (isTyping) {
        // Allow escape to blur/close
        if (event.key === 'Escape') {
          if (activeEl instanceof HTMLElement) activeEl.blur()
        }
        return
      }

      // cmd+k or ctrl+k: Toggle Command Palette
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }

      // 'c' or 'n': Open new task modal
      if (event.key.toLowerCase() === 'c' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        setCreateTaskModalOpen(true)
      }

      // Escape: Close all overlays
      if (event.key === 'Escape') {
        event.preventDefault()
        setCommandPaletteOpen(false)
        setCreateTaskModalOpen(false)
        setSelectedTaskId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setCreateTaskModalOpen,
    isCreateTaskModalOpen,
    selectedTaskId,
    setSelectedTaskId,
  ])
}
