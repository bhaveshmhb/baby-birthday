import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeartReveal({ onDone }) {
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState('draw') // draw → beat → open → done
  const [maskScale, setMaskScale] = useState(0)

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    cv.width = innerWidth; cv.height = innerHeight
    const cx = innerWidth / 2, cy = innerHeight / 2

    // Heart path function — parametric
    const hx = (t) => cx + 160 * Math.pow(Math.sin(t), 3)
    const hy = (t) => cy - (130*Math.cos(t) - 50*Math.cos(2*t) - 20*Math.cos(3*t) - 10*Math.cos(4*t))

    let progress = 0
    let raf

    const drawHeart = (prog, alpha, glowAmt) => {
      ctx.clearRect(0,0,cv.width,cv.height)
      ctx.fillStyle='#000'
      ctx.fillRect(0,0,cv.width,cv.height)

      // Glow
      if(glowAmt > 0) {
        const g = ctx.createRadialGradient(cx, cy-10, 0, cx, cy-10, 220)
        g.addColorStop(0, `rgba(200,96,122,${glowAmt * 0.3})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0,0,cv.width,cv.height)
      }

      // Draw heart outline progressively
      const steps = 300
      const drawSteps = Math.floor(prog * steps)
      if(drawSteps < 2) return

      ctx.beginPath()
      for(let i=0; i<drawSteps; i++) {
        const t = (i/steps) * Math.PI * 2
        const x = hx(t), y = hy(t)
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y)
      }
      ctx.strokeStyle = `rgba(200,96,122,${Math.min(1, prog*2)})`
      ctx.lineWidth = 2
      ctx.shadowBlur = 20
      ctx.shadowColor = '#c8607a'
      ctx.stroke()
      ctx.shadowBlur = 0

      // Fill when fully drawn
      if(prog >= 1) {
        ctx.beginPath()
        for(let i=0; i<=steps; i++) {
          const t=(i/steps)*Math.PI*2
          if(i===0) ctx.moveTo(hx(t),hy(t)); else ctx.lineTo(hx(t),hy(t))
        }
        ctx.closePath()
        const hg = ctx.createRadialGradient(cx-30,cy-40,0,cx,cy,180)
        hg.addColorStop(0,'rgba(255,160,180,0.9)')
        hg.addColorStop(0.5,'rgba(200,96,122,0.85)')
        hg.addColorStop(1,'rgba(140,40,70,0.8)')
        ctx.fillStyle = hg
        ctx.fill()
        ctx.shadowBlur = 40; ctx.shadowColor = '#c8607a'
        ctx.stroke(); ctx.shadowBlur = 0
      }
    }

    // Phase 1: draw the heart outline 0→1 over 2s
    const t0 = Date.now()
    const drawPhase = () => {
      const elapsed = Date.now() - t0
      progress = Math.min(elapsed / 2000, 1)
      drawHeart(progress, 1, progress * 0.5)
      if(progress < 1) { raf = requestAnimationFrame(drawPhase) }
      else {
        // Phase 2: beat (scale up/down twice)
        setPhase('beat')
        setTimeout(() => {
          setPhase('open')
          // Start mask expanding
          const t1 = Date.now()
          const expand = () => {
            const e = Date.now() - t1
            const s = Math.min(e / 800, 1)
            const eased = s < 0.5 ? 4*s*s*s : 1-Math.pow(-2*s+2,3)/2
            setMaskScale(eased)
            if(s < 1) requestAnimationFrame(expand)
            else setTimeout(onDone, 200)
          }
          requestAnimationFrame(expand)
        }, 1200)
      }
    }
    raf = requestAnimationFrame(drawPhase)
    return () => cancelAnimationFrame(raf)
  }, [])

  // SVG clip-path heart mask that expands
  const S = maskScale
  const maxR = Math.sqrt(innerWidth**2 + innerHeight**2) * 0.85

  return (
    <motion.div
      style={{ position:'fixed', inset:0, zIndex:500, background:'#000' }}
      exit={{ opacity:0 }} transition={{ duration:0.5 }}
    >
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0 }}/>

      {/* Heart beat animation overlay */}
      {phase === 'beat' && (
        <motion.div
          style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            pointerEvents:'none',
          }}
        >
          <motion.div
            animate={{ scale:[1,1.18,0.95,1.12,1], opacity:[1,1,1,1,0] }}
            transition={{ duration:1.1, times:[0,.25,.5,.75,1] }}
            style={{ fontSize:'12rem', lineHeight:1, filter:'drop-shadow(0 0 40px #c8607a)' }}
          >🩷</motion.div>
        </motion.div>
      )}

      {/* Expanding heart mask revealing content */}
      {phase === 'open' && (
        <motion.div
          style={{
            position:'absolute', inset:0,
            background:'#000',
            clipPath:`url(#heartClip)`,
            transform:`scale(${1 - maskScale})`,
            transformOrigin:'center',
            pointerEvents:'none',
          }}
        />
      )}

      {phase === 'open' && (
        <svg style={{ position:'absolute', width:0, height:0 }}>
          <defs>
            <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
              <path d="M0.5,0.85 C0.5,0.85 0.05,0.55 0.05,0.32 C0.05,0.18 0.16,0.08 0.28,0.08 C0.37,0.08 0.45,0.13 0.5,0.2 C0.55,0.13 0.63,0.08 0.72,0.08 C0.84,0.08 0.95,0.18 0.95,0.32 C0.95,0.55 0.5,0.85 0.5,0.85 Z"/>
            </clipPath>
          </defs>
        </svg>
      )}
    </motion.div>
  )
}
