import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PANELS = [
  { time:'Before December 13th…', text:'We were just two people who talked too much, laughed too loud, and pretended the closeness didn\'t mean something too deep.', sub:'But it did.' },
  { time:'That night…', text:'The conversation went somewhere neither of us planned. Deeper than even bestfriends go. Scarier than either of us expected while flirting.', sub:'And neither of us tried to stop.' },
  { time:'You asked it first…', text:'Where is this leading us too and how this is gonna transform us from inside.. are we really into something, or just being prepared for a heartbreak?', sub:'That was the most honest thing I\'d ever heard.' },
  { time:'And I told you…', text:'I\'m not looking for something temporary. When I\'m into someone, I realistically see a wife in her.', sub:'and I meant every word.' },
  { time:'What you said me back…', text:'After everything.. all the silence, the weight, the tears, the unspoken tons of feelings, the realness — you said: "I\'m really ready to be the mom of your children."', sub:'I wasn\'t prepared for that babyyy. At all.' },
  { time:'Today…', text:'You turn one year older. And I turn one year more grateful for everything that happened — from strangers to couple...', sub:'Happy Birthday, my person. 🌸' },
]

const SKIES = [
  ['#000','#080310'],['#080310','#120818'],['#180a18','#2a1020'],
  ['#38152e','#140812'],['#7a2248','#280f1e'],['#c8607a','#3a1228'],
]

function Typewriter({ text, onDone }) {
  const [n, setN] = useState(0)
  const [fin, setFin] = useState(false)
  useEffect(() => {
    setN(0); setFin(false); let i = 0
    const id = setInterval(() => {
      i++; setN(i)
      if (i >= text.length) { clearInterval(id); setFin(true); onDone?.() }
    }, 52)
    return () => clearInterval(id)
  }, [text])
  return (
    <>
      {text.slice(0, n)}
      {!fin && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: .52, repeat: Infinity }}
          style={{ color: '#c8607a', fontStyle: 'normal' }}>|</motion.span>
      )}
    </>
  )
}

export default function OurStory({ onContinue }) {
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const autoRef = useRef(null)

  // ALL hooks must be called before any conditional return
  const safeIdx = Math.min(idx, PANELS.length - 1)
  const panel = PANELS[safeIdx]
  const sky = SKIES[Math.min(safeIdx, SKIES.length - 1)]
  const isLast = safeIdx === PANELS.length - 1

  const goNext = useCallback(() => {
    if (!done) return
    clearTimeout(autoRef.current)
    if (safeIdx < PANELS.length - 1) {
      setIdx(safeIdx + 1)
      setDone(false)
    }
  }, [safeIdx, done])

  useEffect(() => {
    if (!done || isLast) return
    autoRef.current = setTimeout(() => {
      setIdx(i => Math.min(i + 1, PANELS.length - 1))
      setDone(false)
    }, 9500)
    return () => clearTimeout(autoRef.current)
  }, [done, isLast])

  if (!panel) return null

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 300 }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
    >
      {/* Sky */}
      <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        animate={{ background: `radial-gradient(ellipse at 50% 70%,${sky[0]} 0%,${sky[1]} 100%)` }}
        transition={{ duration: 2.6, ease: 'easeInOut' }}
      />

      {/* Fading stars */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 1 - (safeIdx / (PANELS.length - 1)) * .88, transition: 'opacity 2.2s ease', pointerEvents: 'none' }}>
        {Array.from({ length: 55 }, (_, i) => (
          <motion.div key={i} style={{ position: 'absolute', left: `${(i * 17) % 100}%`, top: `${(i * 13) % 65}%`, width: 1 + (i % 3) * .5, height: 1 + (i % 3) * .5, background: '#fff', borderRadius: '50%' }}
            animate={{ opacity: [.18, .85, .18] }} transition={{ duration: 1.8 + (i % 4) * .5, delay: (i % 8) * .5, repeat: Infinity }} />
        ))}
      </div>

      {/* Petals */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div key={i} style={{ position: 'absolute', left: `${i * 10}%`, top: -20, zIndex: 2, width: 5 + (i % 4) * 2, height: (5 + (i % 4) * 2) * 1.3, background: 'radial-gradient(ellipse,rgba(242,168,192,.42),rgba(200,96,122,.14))', borderRadius: '50% 0 50% 0', pointerEvents: 'none' }}
          animate={{ y: ['0vh', '112vh'], x: [0, 22, -16, 28, 0], rotate: [0, 360] }}
          transition={{ duration: 9 + (i % 3) * 2, delay: i * .7, repeat: Infinity, ease: 'linear' }} />
      ))}

      {/* Story panel */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div key={safeIdx}
            initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28 }}
            transition={{ type: 'spring', stiffness: 72, damping: 18 }}
            style={{ textAlign: 'center', maxWidth: 660, padding: '0 2rem' }}
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '.07em' }} animate={{ opacity: 1, letterSpacing: '.32em' }} transition={{ delay: .2, duration: 1 }}
              style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: 'clamp(.56rem,1.7vw,.68rem)', textTransform: 'uppercase', color: 'rgba(242,168,192,.62)', marginBottom: '1.3rem' }}
            >
              {panel.time}
            </motion.p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.25rem,3.6vw,1.95rem)', color: '#faf7f2', lineHeight: 1.68, marginBottom: '1.3rem', textShadow: '0 0 45px rgba(242,168,192,.16)' }}>
              <Typewriter text={panel.text} onDone={() => setDone(true)} />
            </h2>
            <AnimatePresence>
              {done && (
                <motion.p initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75 }}
                  style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 300, fontSize: 'clamp(.78rem,2.1vw,.92rem)', color: 'rgba(250,247,242,.38)', letterSpacing: '.07em', fontStyle: 'italic' }}>
                  {panel.sub}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div style={{ position: 'absolute', bottom: '2.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {PANELS.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === safeIdx ? 22 : 5, background: i === safeIdx ? '#f2a8c0' : i < safeIdx ? 'rgba(242,168,192,.42)' : 'rgba(242,168,192,.18)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              style={{ height: 5, borderRadius: 3 }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {done && !isLast && (
            <motion.button key="nxt"
              initial={{ opacity: 0, y: 9, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -7 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(242,168,192,.18)' }} whileTap={{ scale: .95 }}
              onClick={goNext}
              style={{ background: 'transparent', border: '1px solid rgba(242,168,192,.32)', borderRadius: 50, padding: '.62rem 2rem', fontFamily: "'Montserrat',sans-serif", fontWeight: 400, fontSize: '.68rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#f2a8c0', cursor: 'none', display: 'flex', alignItems: 'center', gap: '.5rem' }}
            >
              Next <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </motion.button>
          )}
          {done && isLast && (
            <motion.button key="cont"
              initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, type: 'spring', stiffness: 140 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 38px rgba(242,168,192,.22)' }} whileTap={{ scale: .95 }}
              onClick={onContinue}
              style={{ background: 'transparent', border: '1px solid rgba(242,168,192,.42)', borderRadius: 50, padding: '.82rem 2.6rem', fontFamily: "'Montserrat',sans-serif", fontWeight: 400, fontSize: '.73rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#f2a8c0', cursor: 'none' }}
            >
              See our memories ♡
            </motion.button>
          )}
        </AnimatePresence>

        {done && !isLast && (
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: '.56rem', color: 'rgba(250,247,242,.18)', letterSpacing: '.14em', fontStyle: 'italic' }}>
            auto-advances · or tap next →
          </p>
        )}
      </div>
    </motion.div>
  )
}
