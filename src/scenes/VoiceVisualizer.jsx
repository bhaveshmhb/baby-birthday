import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── HOW TO ADD YOUR VOICE NOTE ────────────────────────────────────
// 1. Record yourself singing Happy Birthday (phone voice memo is perfect)
// 2. Put the file in the /public folder as: birthday-voice.mp3
// 3. That's it — it will play automatically when she clicks play
// ─────────────────────────────────────────────────────────────────

export default function VoiceVisualizer({ onContinue }) {
  const cvRef = useRef(null)
  const rafRef = useRef(null)
  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [vol, setVol] = useState(0.7)
  const gainRef = useRef(null)
  const [showCont, setShowCont] = useState(false)
  const tRef = useRef(0)

  useEffect(()=>{
    setTimeout(()=>setShowCont(true),10000)
  },[])

  // Canvas flower garden
  useEffect(()=>{
    const cv=cvRef.current, ctx=cv.getContext('2d')
    const resize=()=>{cv.width=innerWidth;cv.height=innerHeight}
    resize(); window.addEventListener('resize',resize)

    // Butterflies
    const butterflies=Array.from({length:6},()=>({
      x:Math.random()*innerWidth, y:100+Math.random()*(innerHeight-200),
      vx:(Math.random()-.5)*.8, vy:(Math.random()-.5)*.6,
      ph:Math.random()*Math.PI*2, sz:8+Math.random()*8, wing:0
    }))
    // Sparkle stars
    const sparks=Array.from({length:50},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      life:Math.random(), decay:.008+Math.random()*.015,
      sz:1+Math.random()*3, ph:Math.random()*Math.PI*2
    }))
    // Floating flowers
    const flowers=Array.from({length:14},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vy:-.15-Math.random()*.3, sz:8+Math.random()*12,
      ph:Math.random()*Math.PI*2, rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.02
    }))

    let data=new Uint8Array(256).fill(100)

    let t=0
    const draw=()=>{
      t+=.012; tRef.current=t
      if(analyserRef.current) analyserRef.current.getByteFrequencyData(data)
      const avg=data.reduce((a,b)=>a+b,0)/data.length, norm=avg/128

      ctx.fillStyle=`rgba(0,0,0,.14)`; ctx.fillRect(0,0,cv.width,cv.height)
      const cx=cv.width/2, cy=cv.height/2

      // ── Rose bloom visualizer ──
      const PETALS=16, BASE=90+norm*45
      for(let p=0;p<PETALS;p++){
        const ang=(p/PETALS)*Math.PI*2+t*.28
        const fi=Math.floor((p/PETALS)*data.length*.55)
        const fv=(data[fi]||100)/255
        const pl=BASE+fv*130+Math.sin(t*1.8+p)*.22*18
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang)
        ctx.beginPath()
        ctx.moveTo(0,0)
        ctx.bezierCurveTo(pl*.28,-pl*.14,pl*.68,-pl*.2,pl,0)
        ctx.bezierCurveTo(pl*.68,pl*.2,pl*.28,pl*.14,0,0)
        const a=.12+fv*.32
        const hue=335+p*4
        const g=ctx.createLinearGradient(0,0,pl,0)
        g.addColorStop(0,`hsla(${hue},75%,72%,${a})`)
        g.addColorStop(.55,`hsla(${hue+8},65%,62%,${a*.75})`)
        g.addColorStop(1,'transparent')
        ctx.fillStyle=g; ctx.fill(); ctx.restore()
      }

      // Center orb
      const ob=32+norm*18
      const og=ctx.createRadialGradient(cx,cy,0,cx,cy,ob*2.2)
      og.addColorStop(0,'rgba(242,168,192,.92)'); og.addColorStop(.35,'rgba(200,96,122,.5)'); og.addColorStop(1,'transparent')
      ctx.beginPath(); ctx.arc(cx,cy,ob*2.2,0,Math.PI*2); ctx.fillStyle=og; ctx.fill()
      ctx.beginPath(); ctx.arc(cx,cy,ob*.6,0,Math.PI*2); ctx.fillStyle='rgba(255,230,240,.95)'; ctx.fill()

      // Freq bars ring
      const inner=ob*2.5
      for(let i=0;i<100;i++){
        const ang=(i/100)*Math.PI*2-Math.PI/2
        const idx=Math.floor((i/100)*data.length*.65)
        const v=(data[idx]||90)/255, bh=18+v*85
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang)
        const bg=ctx.createLinearGradient(inner,0,inner+bh,0)
        bg.addColorStop(0,`rgba(242,168,192,${.28+v*.45})`); bg.addColorStop(1,'rgba(200,96,122,0)')
        ctx.fillStyle=bg; ctx.fillRect(inner,-1.4,bh,2.8); ctx.restore()
      }

      // Beat burst particles
      if(norm>1.15){
        for(let i=0;i<4;i++){
          const ang=Math.random()*Math.PI*2, r=BASE+Math.random()*80
          ctx.beginPath(); ctx.arc(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r,2.5+Math.random()*3.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(255,200,220,${.6+Math.random()*.4})`; ctx.fill()
        }
      }

      // Outer glow ring
      ctx.beginPath(); ctx.arc(cx,cy,220+norm*18,0,Math.PI*2)
      ctx.strokeStyle=`rgba(242,168,192,${.05+norm*.04})`; ctx.lineWidth=1; ctx.stroke()

      // ── Butterflies ──
      butterflies.forEach(b=>{
        b.x+=b.vx+Math.sin(t*.8+b.ph)*.5; b.y+=b.vy+Math.sin(t*.6+b.ph)*.4
        b.vx*=.997; b.vy*=.997; b.wing+=.12
        if(b.x<-30)b.x=cv.width+20; if(b.x>cv.width+30)b.x=-20
        if(b.y<30)b.y=cv.height-30; if(b.y>cv.height-30)b.y=30
        if(Math.random()<.006){b.vx+=(Math.random()-.5)*.5;b.vy+=(Math.random()-.5)*.5}
        const wingOpen=Math.abs(Math.sin(b.wing))
        ctx.save(); ctx.translate(b.x,b.y)
        // wings
        for(const side of[-1,1]){
          ctx.save(); ctx.scale(side,1)
          ctx.beginPath()
          ctx.moveTo(0,0); ctx.bezierCurveTo(b.sz*wingOpen,-b.sz*.7,b.sz*1.3*wingOpen,-b.sz*.1,b.sz*wingOpen*1.1,b.sz*.4)
          ctx.bezierCurveTo(b.sz*.6*wingOpen,b.sz*.8,b.sz*.2*wingOpen,b.sz*.5,0,0)
          ctx.fillStyle=`rgba(242,168,192,${.35+wingOpen*.3})`; ctx.fill()
          ctx.restore()
        }
        ctx.restore()
      })

      // ── Sparkling stars ──
      sparks.forEach(s=>{
        s.life-=s.decay
        if(s.life<=0){s.life=1;s.x=Math.random()*cv.width;s.y=Math.random()*cv.height;s.sz=1+Math.random()*3}
        const a=Math.sin(s.life*Math.PI)*.8+norm*.3
        ctx.beginPath(); ctx.arc(s.x,s.y,s.sz,0,Math.PI*2)
        ctx.fillStyle=`rgba(255,220,235,${Math.min(a,.9)})`; ctx.fill()
        if(s.sz>2){
          ctx.beginPath(); ctx.arc(s.x,s.y,s.sz*2.5,0,Math.PI*2)
          const sg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.sz*2.5)
          sg.addColorStop(0,`rgba(242,168,192,${a*.4})`); sg.addColorStop(1,'transparent')
          ctx.fillStyle=sg; ctx.fill()
        }
      })

      // ── Floating flowers ──
      flowers.forEach(f=>{
        f.y+=f.vy; f.rot+=f.rs; f.ph+=.014; f.x+=Math.sin(f.ph)*.35
        if(f.y<-30){f.y=cv.height+20;f.x=Math.random()*cv.width}
        ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(f.rot)
        // 5 petals
        for(let p=0;p<5;p++){
          ctx.save(); ctx.rotate((p/5)*Math.PI*2)
          ctx.beginPath(); ctx.ellipse(f.sz*.5,0,f.sz*.45,f.sz*.2,0,0,Math.PI*2)
          ctx.fillStyle=`rgba(242,168,192,.28)`; ctx.fill(); ctx.restore()
        }
        ctx.beginPath(); ctx.arc(0,0,f.sz*.22,0,Math.PI*2)
        ctx.fillStyle='rgba(255,220,230,.6)'; ctx.fill()
        ctx.restore()
      })

      rafRef.current=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener('resize',resize)}
  },[])

  const play=async()=>{
    try{
      const ctx=new(window.AudioContext||window.webkitAudioContext)()
      analyserRef.current=ctx.createAnalyser(); analyserRef.current.fftSize=512
      gainRef.current=ctx.createGain(); gainRef.current.gain.value=vol

      // Try voice file first
      try{
        const res=await fetch('/baby-birthday/birthday-voice.mp3')
        if(res.ok){
          const buf=await res.arrayBuffer()
          const decoded=await ctx.decodeAudioData(buf)
          const src=ctx.createBufferSource(); src.buffer=decoded; src.loop=false
          src.connect(gainRef.current); gainRef.current.connect(analyserRef.current); analyserRef.current.connect(ctx.destination)
          src.start(); setPlaying(true); return
        }
      }catch(e){}

      // Fallback: synthesised Happy Birthday
      const notes=[261.63,261.63,293.66,261.63,349.23,329.63,261.63,261.63,293.66,261.63,392,349.23,261.63,261.63,523.25,440,349.23,329.63,293.66,466.16,466.16,440,349.23,392,349.23]
      const durs=[.32,.16,.48,.48,.48,.96,.32,.16,.48,.48,.48,.96,.32,.16,.48,.48,.48,.32,.32,.32,.16,.48,.48,.48,.96]
      let st=ctx.currentTime+.1
      notes.forEach((freq,i)=>{
        const osc=ctx.createOscillator(), eg=ctx.createGain()
        osc.type='sine'; osc.frequency.setValueAtTime(freq,st)
        eg.gain.setValueAtTime(0,st); eg.gain.linearRampToValueAtTime(.28,st+.02); eg.gain.exponentialRampToValueAtTime(.001,st+durs[i])
        const o2=ctx.createOscillator(), eg2=ctx.createGain()
        o2.type='sine'; o2.frequency.setValueAtTime(freq*2,st)
        eg2.gain.setValueAtTime(0,st); eg2.gain.linearRampToValueAtTime(.07,st+.02); eg2.gain.exponentialRampToValueAtTime(.001,st+durs[i])
        osc.connect(eg); o2.connect(eg2); eg.connect(gainRef.current); eg2.connect(gainRef.current)
        gainRef.current.connect(analyserRef.current); analyserRef.current.connect(ctx.destination)
        osc.start(st); osc.stop(st+durs[i]); o2.start(st); o2.stop(st+durs[i])
        st+=durs[i]*.86
      })
      setPlaying(true)
    }catch(e){console.log(e)}
  }

  return (
    <motion.div style={{position:'fixed',inset:0,background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',zIndex:300}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}}>
      <canvas ref={cvRef} style={{position:'absolute',inset:0}}/>

      <div style={{position:'relative',zIndex:10,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.5rem'}}>
        <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{delay:.5}}>
          <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.62rem',letterSpacing:'.43em',textTransform:'uppercase',color:'rgba(242,168,192,.52)',marginBottom:'.4rem'}}>✦ &nbsp; a song for you &nbsp; ✦</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:'italic',fontSize:'clamp(1.6rem,4.5vw,2.4rem)',color:'#faf7f2'}}>
            {playing ? 'Happy Birthday, Amruta 🌸' : 'He sang this just for you'}
          </h2>
          {!playing && <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.68rem',color:'rgba(242,168,192,.38)',marginTop:'.4rem',fontStyle:'italic'}}>Bhavesh's voice, with all his love</p>}
        </motion.div>

        {!playing ? (
          <motion.button initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} transition={{delay:.8}}
            whileHover={{scale:1.06,boxShadow:'0 0 55px rgba(200,96,122,.3)'}} whileTap={{scale:.95}} onClick={play}
            style={{background:'rgba(200,96,122,.1)',border:'1px solid rgba(242,168,192,.48)',borderRadius:50,padding:'1rem 3rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.76rem',letterSpacing:'.35em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
            ♪ Play for me
          </motion.button>
        ) : (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:'.68rem',color:'rgba(242,168,192,.52)',letterSpacing:'.12em'}}>♪</span>
            <input type="range" min="0" max="1" step=".01" value={vol} onChange={e=>{setVol(+e.target.value);if(gainRef.current)gainRef.current.gain.value=+e.target.value}}
              style={{width:110,accentColor:'#f2a8c0',cursor:'none'}}/>
            <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:'.68rem',color:'rgba(242,168,192,.52)',letterSpacing:'.12em'}}>♪♪</span>
          </motion.div>
        )}

        <AnimatePresence>
          {showCont && (
            <motion.button initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:100}}
              whileHover={{scale:1.05,boxShadow:'0 0 45px rgba(200,96,122,.25)'}} whileTap={{scale:.95}} onClick={onContinue}
              style={{background:'transparent',border:'1px solid rgba(242,168,192,.4)',borderRadius:50,padding:'.85rem 2.8rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.73rem',letterSpacing:'.3em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
              The finale ♡
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
