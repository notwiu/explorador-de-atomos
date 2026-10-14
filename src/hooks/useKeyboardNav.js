import { useEffect, useRef } from 'react'

// Liga teclas a ações. Funciona com o teclado e com apresentadores de slides
// (passadores), que enviam as teclas de seta e PageUp/PageDown.
//
// Ações (todas opcionais):
//   next      -> seta direita, PageDown
//   prev      -> seta esquerda, PageUp
//   back      -> Esc (se não existir, usa prev)
//   activate  -> Espaço ou Enter (se não existir, usa next)
//   fullscreen-> F
//   light     -> L
//   restart   -> R
//   notes     -> N
export function useKeyboardNav(handlers) {
  const ref = useRef(handlers)
  ref.current = handlers

  useEffect(() => {
    const run = (fn, e) => {
      if (!fn) return
      e.preventDefault()
      fn()
    }

    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const h = ref.current
      const key = e.key

      // Quando um botão está em foco, Enter/Espaço já ativam o próprio botão.
      const onButton = e.target instanceof HTMLElement && e.target.closest('button')

      if (key === 'ArrowRight' || key === 'PageDown') run(h.next, e)
      else if (key === 'ArrowLeft' || key === 'PageUp') run(h.prev, e)
      else if (key === 'Escape') run(h.back ?? h.prev, e)
      else if ((key === ' ' || key === 'Enter') && !onButton) run(h.activate ?? h.next, e)
      else if (key.toLowerCase() === 'f') h.fullscreen?.()
      else if (key.toLowerCase() === 'l') h.light?.()
      else if (key.toLowerCase() === 'r') h.restart?.()
      else if (key.toLowerCase() === 'n') h.notes?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
