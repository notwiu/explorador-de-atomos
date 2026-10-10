import { useEffect, useState } from 'react'

// Retorna true enquanto houver atividade (mouse/teclado/toque).
// Depois de `delay` ms sem atividade, retorna false (os controles somem).
export function useIdleHide(delay = 3500) {
  const [active, setActive] = useState(true)

  useEffect(() => {
    let timer
    const wake = () => {
      setActive(true)
      clearTimeout(timer)
      timer = setTimeout(() => setActive(false), delay)
    }
    wake()
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart']
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, wake))
    }
  }, [delay])

  return active
}
