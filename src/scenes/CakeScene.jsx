import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── The big pink birthday cake celebration scene ───────────────
// Appears AFTER the story panels, BEFORE the polaroid wall
// She blows into the mic to blow out the candles!
// ────────────────────────────────────────────────────────────────

function useMicBlow(onBlow) {
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [level, setLevel] = useState(0)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      analyserRef.current = analyser
      setListening(true)

      const data = new Uint8Array(analyser.frequencyBinCount)
      const check = () => {
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        setLevel(avg)
        if (avg > 28) { // blow threshold
          onBlow()
          stream.getTracks().forEach(t => t.stop())
          return
        }
        rafRef.current = requestAnimationFrame(check)
      }
      rafRef.current = requestAnimationFrame(check)
    } catch (e) {
      console.log('Mic error:', e)
    }
  }, [onBlow])

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  return { start, listening, level }
}

// ─── Cake SVG (front view, on table, pink frosting, "Happy Birthday Amruta" in cursive) ───
function CakeSVG({ blowing, blown, candlePhase }) {
  // candlePhase: 0=normal, 1=flickering, 2=out
  const flames = [
    { x: 178, cx: 178 },
    { x: 248, cx: 248 },
    { x: 318, cx: 318 },
  ]

  return (
    <svg viewBox="0 0 500 420" width="100%" style={{ maxWidth: 460, filter: 'drop-shadow(0 20px 60px rgba(200,96,122,0.45))' }}>
      {/* Table surface */}
      <ellipse cx="250" cy="390" rx="230" ry="22" fill="rgba(255,200,220,0.18)" />
      <rect x="30" y="382" width="440" height="18" rx="9" fill="rgba(255,180,210,0.22)" />

      {/* === CAKE BASE — 3 tiers === */}
      {/* Bottom tier */}
      <rect x="55" y="290" width="390" height="95" rx="16" fill="#f9c5d8" />
      <rect x="55" y="290" width="390" height="14" rx="8" fill="#f48fb1" />
      {/* Frosting drips bottom */}
      {[80,118,156,194,232,270,308,346,384,422].map((x,i) => (
        <ellipse key={i} cx={x} cy={295} rx={10} ry={13} fill="#fff0f5" />
      ))}
      {/* Bottom tier dots decoration */}
      {[100,150,200,250,300,350,400].map((x,i) => (
        <circle key={i} cx={x} cy={338} r={5} fill="#e91e8c" opacity={0.4} />
      ))}

      {/* Middle tier */}
      <rect x="95" y="195" width="310" height="100" rx="14" fill="#f48fb1" />
      <rect x="95" y="195" width="310" height="14" rx="7" fill="#e91e8c" opacity={0.7} />
      {/* Frosting drips middle */}
      {[115,150,185,220,255,290,325,360].map((x,i) => (
        <ellipse key={i} cx={x} cy={200} rx={9} ry={12} fill="#fff0f5" />
      ))}

      {/* Top tier */}
      <rect x="130" y="115" width="240" height="85" rx="12" fill="#f8bbd0" />
      <rect x="130" y="115" width="240" height="12" rx="6" fill="#f48fb1" />
      {/* Frosting drips top */}
      {[148,180,212,244,276,308,340].map((x,i) => (
        <ellipse key={i} cx={x} cy={119} rx={8} ry={11} fill="#fff0f5" />
      ))}

      {/* "Happy Birthday" text on middle tier */}
      <text
        x="250" y="250"
        textAnchor="middle"
        fontFamily="Dancing Script, cursive"
        fontSize="18"
        fill="#c2185b"
        opacity={0.85}
      >Happy Birthday</text>

      {/* "Amruta" in large cursive frosting on top tier */}
      <text
        x="250" y="168"
        textAnchor="middle"
        fontFamily="Dancing Script, cursive"
        fontSize="30"
        fontWeight="700"
        fill="#c2185b"
      >Amruta</text>
      {/* Little heart after name */}
      <text x="355" y="165" fontFamily="serif" fontSize="16" fill="#e91e8c">♡</text>

      {/* Flower decorations on cake */}
      {[[115,230],[385,230],[105,315],[395,315]].map(([x,y],i) => (
        <g key={i}>
          {[0,72,144,216,288].map((a,j) => (
            <ellipse key={j}
              cx={x + 8*Math.cos(a*Math.PI/180)}
              cy={y + 8*Math.sin(a*Math.PI/180)}
              rx={5} ry={3.5}
              fill="#f8bbd0"
              transform={`rotate(${a}, ${x + 8*Math.cos(a*Math.PI/180)}, ${y + 8*Math.sin(a*Math.PI/180)})`}
            />
          ))}
          <circle cx={x} cy={y} r={4} fill="#fff59d" />
        </g>
      ))}

      {/* Pink pearl borders */}
      {[220,245,270,290].map((y,i) => [140,175,210,245,280,315,350].map((x,j) => (
        <circle key={`${i}-${j}`} cx={x} cy={y} r={2.2} fill="rgba(255,255,255,0.6)" opacity={i===0||i===3?0.8:0} />
      )))}

      {/* === CANDLES === */}
      {flames.map((c, i) => (
        <g key={i}>
          {/* Candle body */}
          <rect x={c.x - 7} y={75} width={14} height={42} rx={4}
            fill={['#ff8fab','#ffd6e7','#ffb3c6'][i]}
          />
          {/* Candle stripes */}
          {[83,91,99,107].map((y,j) => (
            <rect key={j} x={c.x - 7} y={y} width={14} height={2} rx={1}
              fill="rgba(255,255,255,0.5)" />
          ))}
          {/* Wick */}
          <line x1={c.x} y1={75} x2={c.x} y2={68} stroke="#5d4037" strokeWidth={1.5} strokeLinecap="round" />

          {/* FLAME */}
          {candlePhase < 2 && (
            <g>
              {/* Outer glow */}
              <motion.ellipse
                cx={c.x} cy={60}
                rx={blowing ? 14 : 10} ry={blowing ? 18 : 14}
                fill="rgba(255,200,50,0.25)"
                animate={{ rx: blowing ? [10,18,8,16,6] : [9,11,9], ry: blowing ? [14,20,10,18,6] : [13,15,13], opacity: candlePhase===1 ? [1,0.3,1,0.1,1] : 1 }}
                transition={{ duration: blowing ? 0.8 : 1.2, repeat: blowing ? 0 : Infinity }}
              />
              {/* Main flame */}
              <motion.path
                d={`M ${c.x} 68 Q ${c.x + (blowing?12:5)} 58 ${c.x + (blowing?-2:2)} 48 Q ${c.x - (blowing?8:5)} 58 ${c.x} 68 Z`}
                fill="url(#flameGrad)"
                animate={{
                  d: blowing
                    ? [`M ${c.x} 68 Q ${c.x+12} 55 ${c.x+2} 44 Q ${c.x-8} 55 ${c.x} 68 Z`,
                       `M ${c.x} 68 Q ${c.x+18} 52 ${c.x+4} 40 Q ${c.x-10} 52 ${c.x} 68 Z`,
                       `M ${c.x} 68 Q ${c.x+22} 58 ${c.x+6} 50 Q ${c.x-6} 60 ${c.x} 68 Z`]
                    : [`M ${c.x} 68 Q ${c.x+5} 58 ${c.x+2} 48 Q ${c.x-5} 58 ${c.x} 68 Z`,
                       `M ${c.x} 68 Q ${c.x+3} 56 ${c.x} 46 Q ${c.x-4} 56 ${c.x} 68 Z`,
                       `M ${c.x} 68 Q ${c.x+5} 58 ${c.x+2} 48 Q ${c.x-5} 58 ${c.x} 68 Z`],
                  opacity: candlePhase===1 ? [1,0.2,0.8,0.1,0.9,0] : 1,
                  scaleX: blowing ? [1,1.4,1.8,2.2,0] : 1,
                }}
                transition={{ duration: blowing ? 0.6 : 1.8, repeat: blowing ? 0 : Infinity }}
                style={{ transformOrigin: `${c.x}px 68px` }}
              />
              {/* Inner bright flame */}
              <motion.path
                d={`M ${c.x} 67 Q ${c.x+3} 60 ${c.x+1} 53 Q ${c.x-3} 60 ${c.x} 67 Z`}
                fill="rgba(255,255,200,0.9)"
                animate={{ opacity: candlePhase===1?[1,0.1,1,0,1]:1 }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </g>
          )}
          {/* Smoke after blow */}
          {candlePhase === 2 && (
            <motion.path
              d={`M ${c.x} 68 Q ${c.x+5} 58 ${c.x} 48 Q ${c.x-5} 38 ${c.x+3} 28`}
              stroke="rgba(200,200,200,0.6)" strokeWidth={2} fill="none" strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0,0.7,0.5,0], pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          )}
        </g>
      ))}

      {/* Flame gradient */}
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="80%">
          <stop offset="0%" stopColor="#fff176" />
          <stop offset="40%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ff6d00" stopOpacity={0.8} />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ─── Cute SVG Puppy ───
function CutePuppy({ style, flip }) {
  return (
    <motion.div
      style={{ position: 'absolute', ...style, transform: flip ? 'scaleX(-1)' : 'none', pointerEvents: 'none' }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 1.5 }}
    >
      <svg viewBox="0 0 120 120" width="90" height="90">
        {/* Body */}
        <ellipse cx="60" cy="80" rx="32" ry="26" fill="#c8a882" />
        {/* Head */}
        <circle cx="60" cy="50" r="26" fill="#c8a882" />
        {/* Ears — floppy */}
        <ellipse cx="34" cy="36" rx="12" ry="20" fill="#b8906a" transform="rotate(-20 34 36)" />
        <ellipse cx="86" cy="36" rx="12" ry="20" fill="#b8906a" transform="rotate(20 86 36)" />
        {/* Inner ear */}
        <ellipse cx="34" cy="38" rx="7" ry="14" fill="#e8b4a0" transform="rotate(-20 34 38)" />
        <ellipse cx="86" cy="38" rx="7" ry="14" fill="#e8b4a0" transform="rotate(20 86 38)" />
        {/* Eyes */}
        <circle cx="50" cy="46" r="7" fill="#3e2723" />
        <circle cx="70" cy="46" r="7" fill="#3e2723" />
        <circle cx="52" cy="44" r="2.5" fill="white" />
        <circle cx="72" cy="44" r="2.5" fill="white" />
        {/* Nose */}
        <ellipse cx="60" cy="57" rx="7" ry="5" fill="#3e2723" />
        <ellipse cx="60" cy="56" rx="4" ry="2.5" fill="#6d4c41" />
        {/* Mouth */}
        <path d="M 54 61 Q 60 67 66 61" stroke="#3e2723" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="42" cy="56" r="7" fill="rgba(255,150,150,0.35)" />
        <circle cx="78" cy="56" r="7" fill="rgba(255,150,150,0.35)" />
        {/* Tail */}
        <path d="M 88 75 Q 108 60 105 78 Q 102 92 90 88" fill="#c8a882" />
        {/* Tiny paws */}
        <ellipse cx="40" cy="100" rx="12" ry="8" fill="#b8906a" />
        <ellipse cx="80" cy="100" rx="12" ry="8" fill="#b8906a" />
        {/* Bow on ear — pink! */}
        <path d="M 26 22 Q 34 28 26 34" stroke="#f48fb1" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 42 22 Q 34 28 42 34" stroke="#f48fb1" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="34" cy="28" r="3" fill="#f48fb1" />
      </svg>
    </motion.div>
  )
}

// ─── Floating balloon ───
function Balloon({ x, color, delay, size = 1 }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, bottom: -20, pointerEvents: 'none' }}
      animate={{ y: [0, -25, 0], x: [0, 8, -8, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg viewBox="0 0 60 90" width={45 * size} height={67 * size}>
        <ellipse cx="30" cy="32" rx="24" ry="28" fill={color} />
        <ellipse cx="22" cy="22" rx="8" ry="6" fill="rgba(255,255,255,0.35)" />
        <path d="M 30 60 Q 28 70 30 80 Q 32 70 30 60" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M 30 58 L 26 62 L 30 60 L 34 62 Z" fill={color} />
        <path d="M 24 80 Q 30 75 36 80" stroke="rgba(100,100,100,0.4)" strokeWidth="1" fill="none" />
      </svg>
    </motion.div>
  )
}

// ─── Confetti burst ───
function ConfettiBurst({ active }) {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#f48fb1','#f8bbd0','#ffd6e7','#fff','#ffb3c6','#ff80ab','#fce4ec'][i % 7],
    angle: (i / 60) * 360,
    dist: 80 + Math.random() * 140,
    size: 4 + Math.random() * 8,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }))

  if (!active) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute', left: '50%', top: '40%',
            width: p.size, height: p.shape === 'rect' ? p.size * 1.8 : p.size,
            background: p.color, borderRadius: p.shape === 'circle' ? '50%' : '2px',
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: Math.cos(p.angle * Math.PI / 180) * p.dist,
            y: Math.sin(p.angle * Math.PI / 180) * p.dist - 80,
            opacity: 0, rotate: 360, scale: 0,
          }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: Math.random() * 0.3 }}
        />
      ))}
    </div>
  )
}

// ─── Sparkle star ───
function Sparkle({ x, y, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', fontSize: '1rem' }}
      animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 2 + Math.random() * 3 }}
    >✨</motion.div>
  )
}

const BALLOONS = [
  { x: '3%',  color: '#f48fb1', delay: 0,   size: 1.1 },
  { x: '10%', color: '#ffd6e7', delay: 0.4, size: 0.9 },
  { x: '78%', color: '#f8bbd0', delay: 0.2, size: 1.0 },
  { x: '88%', color: '#ff80ab', delay: 0.6, size: 1.2 },
  { x: '94%', color: '#fce4ec', delay: 0.1, size: 0.85 },
  { x: '18%', color: '#ffb3c6', delay: 0.8, size: 0.95 },
  { x: '68%', color: '#f48fb1', delay: 0.5, size: 1.05 },
]

const SPARKLES = [
  { x: '8%', y: '15%', delay: 0 }, { x: '85%', y: '12%', delay: 0.5 },
  { x: '5%', y: '55%', delay: 1 }, { x: '90%', y: '50%', delay: 1.5 },
  { x: '50%', y: '8%', delay: 0.3 }, { x: '30%', y: '10%', delay: 0.8 },
  { x: '70%', y: '10%', delay: 1.2 },
]

export default function CakeScene({ onContinue }) {
  const [phase, setPhase] = useState('enter')
  // enter → ready → blowing → blown → celebrate → continue
  const [candlePhase, setCandlePhase] = useState(0) // 0=lit, 1=flickering, 2=out
  const [confetti, setConfetti] = useState(false)
  const [micError, setMicError] = useState(false)
  const [countdown, setCountdown] = useState(null) // null | 3 | 2 | 1 | 'BLOW!'
  const [micLevel, setMicLevel] = useState(0)

  // Start the 3-2-1 countdown then listen for blow
  const startCountdown = useCallback(async () => {
    setPhase('countdown')
    // 3
    setCountdown(3)
    await new Promise(r => setTimeout(r, 900))
    setCountdown(2)
    await new Promise(r => setTimeout(r, 900))
    setCountdown(1)
    await new Promise(r => setTimeout(r, 900))
    setCountdown('BLOW! 💨')
    setPhase('blowing')

    // Start mic listening
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)

      let blown = false
      const check = () => {
        if (blown) return
        analyser.getByteFrequencyData(data)
        const avg = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10
        setMicLevel(avg)
        if (avg > 30) {
          blown = true
          stream.getTracks().forEach(t => t.stop())
          triggerBlow()
          return
        }
        requestAnimationFrame(check)
      }
      requestAnimationFrame(check)
    } catch (e) {
      setMicError(true)
      // fallback — auto blow after 4s
      setTimeout(triggerBlow, 4000)
    }
  }, [])

  const triggerBlow = useCallback(() => {
    setCandlePhase(1) // flicker
    setCountdown(null)
    setTimeout(() => {
      setCandlePhase(2) // out
      setPhase('blown')
      setConfetti(true)
      setTimeout(() => setConfetti(false), 1500)
      setTimeout(() => setPhase('celebrate'), 800)
      setTimeout(() => setPhase('continue'), 5000)
    }, 800)
  }, [])

  const enterPhase = useCallback(() => setPhase('ready'), [])

  useEffect(() => {
    const t = setTimeout(enterPhase, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, #2d0a18 0%, #000 70%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', zIndex: 300,
      }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} transition={{ duration: 1 }}
    >
      {/* Balloons */}
      {BALLOONS.map((b, i) => <Balloon key={i} {...b} />)}

      {/* Sparkles */}
      {SPARKLES.map((s, i) => <Sparkle key={i} {...s} />)}

      {/* Puppies! */}
      <CutePuppy style={{ left: '2%', bottom: '8%' }} />
      <CutePuppy style={{ right: '2%', bottom: '6%' }} flip />

      {/* Confetti burst */}
      <ConfettiBurst active={confetti} />

      {/* Floating pink stars bg */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', left: `${5 + i * 4.5}%`, top: `${10 + (i * 31) % 70}%`, fontSize: '0.8rem', pointerEvents: 'none' }}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + Math.random() * 3, delay: i * 0.2, repeat: Infinity }}
        >🌸</motion.div>
      ))}

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', padding: '0 1rem' }}>

        {/* Header */}
        <AnimatePresence>
          {phase !== 'countdown' && phase !== 'blowing' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: '.62rem', letterSpacing: '.45em', textTransform: 'uppercase', color: 'rgba(242,168,192,.55)', marginBottom: '.4rem' }}>
                ✦ &nbsp; just for you &nbsp; ✦
              </p>
              {phase !== 'celebrate' && phase !== 'continue' && (
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.6rem,4.5vw,2.4rem)', color: '#faf7f2', textShadow: '0 0 40px rgba(242,168,192,.2)' }}>
                  Make a wish, Amruta 🌸
                </h2>
              )}
              {(phase === 'celebrate' || phase === 'continue') && (
                <motion.h2
                  initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 14 }}
                  style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: '#faf7f2', textShadow: '0 0 60px rgba(242,168,192,.4)' }}
                >
                  🎉 Happy Birthday, Amruta! 🎉
                </motion.h2>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown overlay */}
        <AnimatePresence mode="wait">
          {(phase === 'countdown' || phase === 'blowing') && countdown && (
            <motion.div
              key={String(countdown)}
              initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              style={{ position: 'absolute', top: '15%', zIndex: 30, textAlign: 'center' }}
            >
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 'clamp(2.5rem,10vw,5rem)', color: '#f48fb1', textShadow: '0 0 40px rgba(244,143,177,.6)', lineHeight: 1 }}>
                {countdown}
              </p>
              {phase === 'blowing' && (
                <motion.p
                  animate={{ opacity: [.5, 1, .5] }} transition={{ duration: .8, repeat: Infinity }}
                  style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: '.75rem', color: 'rgba(242,168,192,.6)', letterSpacing: '.2em', marginTop: '.5rem' }}
                >
                  {micError ? 'Blow on the screen! 💨' : 'Blow into the mic! 💨'}
                </motion.p>
              )}
              {/* Mic level bar */}
              {phase === 'blowing' && !micError && (
                <div style={{ marginTop: '.8rem', width: 120, height: 8, background: 'rgba(242,168,192,.15)', borderRadius: 4, overflow: 'hidden', margin: '.8rem auto 0' }}>
                  <motion.div style={{ height: '100%', background: '#f48fb1', borderRadius: 4 }} animate={{ width: `${Math.min(micLevel * 3, 100)}%` }} transition={{ duration: .05 }} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CAKE */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: .3, type: 'spring', stiffness: 80, damping: 16 }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          <CakeSVG
            blowing={phase === 'blowing'}
            blown={phase === 'blown' || phase === 'celebrate' || phase === 'continue'}
            candlePhase={candlePhase}
          />
        </motion.div>

        {/* Action buttons */}
        <AnimatePresence mode="wait">
          {phase === 'ready' && (
            <motion.button
              key="blow-btn"
              initial={{ opacity: 0, y: 16, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18, delay: .5 }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(244,143,177,.35)' }}
              whileTap={{ scale: .95 }}
              onClick={startCountdown}
              style={{ background: 'rgba(244,143,177,.12)', border: '1px solid rgba(244,143,177,.5)', borderRadius: 50, padding: '1rem 3rem', fontFamily: "'Montserrat',sans-serif", fontWeight: 400, fontSize: '.78rem', letterSpacing: '.32em', textTransform: 'uppercase', color: '#f48fb1', cursor: 'none', display: 'flex', alignItems: 'center', gap: '.6rem' }}
            >
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>🕯️</motion.span>
              Blow the candles
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: .5 }}>🕯️</motion.span>
            </motion.button>
          )}

          {(phase === 'celebrate' || phase === 'continue') && (
            <motion.div
              key="celebrate"
              initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <motion.p
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 'clamp(1rem,3vw,1.3rem)', color: 'rgba(250,247,242,.75)' }}
              >
                Your wish is on its way to the universe ✨
              </motion.p>
              {phase === 'continue' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .5, type: 'spring', stiffness: 120 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 45px rgba(200,96,122,.25)' }}
                  whileTap={{ scale: .96 }}
                  onClick={onContinue}
                  style={{ background: 'transparent', border: '1px solid rgba(242,168,192,.42)', borderRadius: 50, padding: '.85rem 2.8rem', fontFamily: "'Montserrat',sans-serif", fontWeight: 400, fontSize: '.73rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#f2a8c0', cursor: 'none' }}
                >
                  Continue ♡
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pink cupcakes floating row */}
        {(phase === 'celebrate' || phase === 'continue') && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '1.2rem', fontSize: '1.6rem', marginTop: '.5rem' }}
          >
            {['🧁','🎂','🧁','🎀','🧁','🎂','🧁'].map((e, i) => (
              <motion.span key={i}
                animate={{ y: [0, -8, 0], rotate: [0, i%2===0?10:-10, 0] }}
                transition={{ duration: 1.5 + i*.2, repeat: Infinity, delay: i*.15 }}
              >{e}</motion.span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom sparkle row */}
      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '.8rem', opacity: .4 }}>
        {['🌸','✨','🎀','✨','🌸','✨','🎀','✨','🌸'].map((e, i) => (
          <motion.span key={i} style={{ fontSize: '.8rem' }}
            animate={{ opacity: [.3, .8, .3] }}
            transition={{ duration: 2, delay: i*.2, repeat: Infinity }}
          >{e}</motion.span>
        ))}
      </div>
    </motion.div>
  )
}
