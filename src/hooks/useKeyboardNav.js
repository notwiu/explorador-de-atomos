import { useEffect, useRef } from 'react'

// Liga teclas a ações. Funciona com o teclado e com apresentadores de slides
// (passadores), que enviam as teclas de seta e PageUp/PageDown.
//
// Exemplo: useKeyboardNav({ next, prev, fullscreen, light })
export function useKeyboardNav(handlers) {
  const ref = useRef(handlers)
  ref.current = handlers

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const h = ref.current
      const key = e.key

      // Quando um botão está em foco, Enter/Espaço já ativam o próprio botão.
      const onButton = e.target instanceof HTMLElement && e.target.closest('button')

      if (['ArrowRight', 'PageDown'].includes(key) || ((key === ' ' || key === 'Enter') && !onButton)) {
        if (h.next) {
          e.preventDefault()
          h.next()
        }
      } else if (['ArrowLeft', 'PageUp', 'Escape'].includes(key)) {
        if (h.prev) {
          e.preventDefault()
          h.prev()
        }
      } else if (key.toLowerCase() === 'f') {
        h.fullscreen?.()
      } else if (key.toLowerCase() === 'l') {
        h.light?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
