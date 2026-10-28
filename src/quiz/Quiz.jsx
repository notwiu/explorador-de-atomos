import { useEffect, useReducer, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { quizBank } from '../data/quiz.js'
import { reduce } from './engine.js'
import Menu from './Menu.jsx'
import Question from './Question.jsx'
import Correct from './Correct.jsx'
import Final from './Final.jsx'
import styles from './Quiz.module.css'

// Quiz em tela cheia com dois modos: duelo de equipes (A × B) e solo.
// O teclado é tratado aqui dentro (o App não mexe nas teclas desta tela, exceto F e L).
//
// Teclas: no menu, 1/2 ou setas + Enter. Nas perguntas, A–D ou 1–4. No acerto, Enter/Espaço/→.
// Esc: no menu volta à linha do tempo; no jogo pede confirmação (Esc duas vezes).
export default function Quiz({ onExit, light }) {
  const [view, setView] = useState('menu') // 'menu' | 'game'
  const [selected, setSelected] = useState(0)
  const [game, dispatch] = useReducer(reduce, null)
  const [armed, setArmed] = useState(false)
  const armTimer = useRef(null)

  const start = (mode) => {
    dispatch({ type: 'start', mode, bank: quizBank })
    setView('game')
    setArmed(false)
  }
  const toMenu = () => {
    clearTimeout(armTimer.current)
    setView('menu')
    setArmed(false)
  }

  const latest = useRef({})
  latest.current = { view, selected, game, armed, start, toMenu, onExit }

  useEffect(() => () => clearTimeout(armTimer.current), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const { view, selected, game, armed, start, toMenu, onExit } = latest.current
      const key = e.key
      const single = key.length === 1 ? key.toLowerCase() : ''
      const done = () => e.preventDefault()

      if (view === 'menu') {
        if (key === 'ArrowLeft') setSelected(0)
        else if (key === 'ArrowRight') setSelected(1)
        else if (single === '1') start('teams')
        else if (single === '2') start('solo')
        else if (key === 'Enter' || key === ' ') start(selected === 0 ? 'teams' : 'solo')
        else if (key === 'Escape') onExit()
        else return
        return done()
      }

      if (!game) return
      if (key === 'Escape') {
        if (game.phase === 'done' || armed) toMenu()
        else {
          setArmed(true)
          clearTimeout(armTimer.current)
          armTimer.current = setTimeout(() => setArmed(false), 2500)
        }
        return done()
      }
      if (game.phase === 'asking') {
        const idx = single ? '1234'.indexOf(single) : -1
        const idxL = single ? 'abcd'.indexOf(single) : -1
        const pick = idx >= 0 ? idx : idxL
        if (pick >= 0) {
          dispatch({ type: 'pick', index: pick })
          return done()
        }
      } else if (game.phase === 'correct') {
        if (key === 'Enter' || key === ' ' || key === 'ArrowRight') {
          dispatch({ type: 'next' })
          return done()
        }
      } else if (game.phase === 'done') {
        if (key === 'Enter' || key === ' ') {
          start(game.mode)
          return done()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const screen = (() => {
    if (view === 'menu') return <Menu key="menu" selected={selected} onSelect={setSelected} onStart={start} />
    if (game.phase === 'asking') return <Question key={`q${game.qi}`} game={game} onPick={(index) => dispatch({ type: 'pick', index })} />
    if (game.phase === 'correct') return <Correct key={`c${game.qi}`} game={game} light={light} onNext={() => dispatch({ type: 'next' })} />
    return <Final key="final" game={game} light={light} onAgain={() => start(game.mode)} onMenu={toMenu} />
  })()

  return (
    <div className={styles.quiz}>
      <AnimatePresence mode="wait">{screen}</AnimatePresence>
      {armed && <div className={styles.toast}>Pressione Esc de novo para sair do jogo</div>}
    </div>
  )
}
