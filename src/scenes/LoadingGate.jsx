import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CORRECT = 'amruta'
const PRE = [
  { text:'Gathering stardust from 8th April…', ms:1100 },
  { text:'Collecting memories from NAvodayaa…', ms:1300 },
  { text:'Wrapping all my love in code…', ms:1000 },
  { text:'Folding rose petals for my love…', ms:950 },
]
const POST = [
  { text:'Identity confirmed 🌸', ms:900 },
  { text:'Unlocking my babys universe…', ms:1000 },
  { text:'Almost ready aytuuu…', ms:750 },
  { text:'✦', ms:500 },
]

export default function LoadingGate({ onUnlock }) {
  const [phase, setPhase] = useState('pre') // pre | check | post | done
  const [prog, setProg] = useState(0)
  const [stepI, setStepI] = useState(0)
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState(false)
  const progRef = useRef(0), rafRef = useRef(null)

  useEffect(() => {
    if(phase!=='pre' && phase!=='post') return
    const target = phase==='pre' ? 48 : 100
    const dur    = phase==='pre' ? 5200 : 2800
    const start  = progRef.current, t0=Date.now()
    const tick=()=>{
      const r=Math.min((Date.now()-t0)/dur,1)
      const e=r<.5?2*r*r:-1+(4-2*r)*r
      progRef.current=start+(target-start)*e
      setProg(progRef.current)
      if(r<1){rafRef.current=requestAnimationFrame(tick)}
      else if(phase==='pre') setPhase('check')
      else { setPhase('done'); setTimeout(onUnlock,500) }
    }
    rafRef.current=requestAnimationFrame(tick)
    return()=>cancelAnimationFrame(rafRef.current)
  },[phase])

  const steps = phase==='pre'||phase==='check' ? PRE : POST
  useEffect(()=>{
    if(stepI>=steps.length)return
    const t=setTimeout(()=>setStepI(i=>i+1),steps[stepI]?.ms||1000)
    return()=>clearTimeout(t)
  },[stepI,phase])
  useEffect(()=>{ if(phase==='post')setStepI(0) },[phase])

  const label = phase==='check' ? 'Waiting for verification…' : (steps[Math.min(stepI,steps.length-1)]?.text||'✦')

  const submit = e => {
    e?.preventDefault()
    if(input.trim().toLowerCase()===CORRECT){ setPhase('post') }
    else { setShake(true); setInput(''); setHint(true); setTimeout(()=>setShake(false),550) }
  }

  return (
    <motion.div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 55%, #160810 0%, #000 72%)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:400,overflow:'hidden'}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.03}} transition={{duration:.9}}
    >
      {/* ambient dots */}
      {Array.from({length:30},(_,i)=>(
        <motion.div key={i} style={{position:'absolute',left:`${3+i*3.2}%`,top:`${8+(i*31)%84}%`,width:1.4,height:1.4,borderRadius:'50%',background:'rgba(242,168,192,.45)',pointerEvents:'none'}}
          animate={{opacity:[.1,.65,.1]}} transition={{duration:2.2+(i%4)*.7,delay:(i*.18)%4,repeat:Infinity}}/>
      ))}
      {/* floating hearts */}
      {[15,35,55,75,90].map((x,i)=>(
        <motion.div key={i} style={{position:'absolute',left:`${x}%`,top:`${20+(i*13)%55}%`,fontSize:'10px',color:'rgba(200,96,122,.2)',pointerEvents:'none',userSelect:'none'}}
          animate={{y:[-8,8,-8],opacity:[.1,.28,.1]}} transition={{duration:4+i*.6,delay:i*.8,repeat:Infinity,ease:'easeInOut'}}>♡</motion.div>
      ))}

      <motion.div initial={{opacity:0,y:36,scale:.94}} animate={{opacity:1,y:0,scale:1}}
        transition={{delay:.35,type:'spring',stiffness:80,damping:18}}
        style={{width:'min(450px,92vw)',background:'rgba(255,255,255,.025)',border:'1px solid rgba(242,168,192,.12)',borderRadius:28,padding:'clamp(2rem,6vw,3rem)',backdropFilter:'blur(24px)',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.8rem',position:'relative',zIndex:10}}
      >
        <div style={{textAlign:'center'}}>
          <motion.p animate={{opacity:[.4,.9,.4]}} transition={{duration:3,repeat:Infinity}}
            style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.6rem',letterSpacing:'.45em',textTransform:'uppercase',color:'rgba(242,168,192,.6)',marginBottom:'.7rem'}}>
            ✦ &nbsp; loading your gift &nbsp; ✦
          </motion.p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize:'clamp(1.5rem,4.5vw,2rem)',color:'#faf7f2',textShadow:'0 0 50px rgba(242,168,192,.22)',lineHeight:1.3}}>
            Something special<br/>is being prepared…
          </h1>
        </div>

        {/* progress */}
        <div style={{width:'100%'}}>
          <div style={{width:'100%',height:2,background:'rgba(242,168,192,.1)',borderRadius:2,overflow:'hidden'}}>
            <motion.div animate={{width:`${prog}%`}} transition={{duration:.22,ease:'linear'}}
              style={{height:'100%',background:'linear-gradient(90deg,rgba(200,96,122,.7),#f2a8c0)',borderRadius:2,boxShadow:'0 0 10px rgba(242,168,192,.55)'}}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'.4rem'}}>
            <AnimatePresence mode="wait">
              <motion.p key={label} initial={{opacity:0,x:-7}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{duration:.32}}
                style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:'.66rem',color:'rgba(250,247,242,.36)',fontStyle:'italic'}}>
                {label}
              </motion.p>
            </AnimatePresence>
            <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:'.66rem',color:'rgba(242,168,192,.5)'}}>{Math.round(prog)}%</p>
          </div>
        </div>

        {/* checkpoint */}
        <AnimatePresence>
          {phase==='check' && (
            <motion.div initial={{opacity:0,y:14,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8}}
              transition={{type:'spring',stiffness:140,damping:18}} style={{width:'100%'}}>
              <div style={{background:'rgba(200,96,122,.05)',border:'1px solid rgba(200,96,122,.18)',borderRadius:18,padding:'1.4rem',textAlign:'center'}}>
                <motion.div animate={{rotate:[0,-8,8,-5,5,0]}} transition={{duration:.65,delay:.2}} style={{fontSize:'1.7rem',marginBottom:'.55rem'}}>🔐</motion.div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'.92rem',color:'rgba(250,247,242,.7)',lineHeight:1.65,marginBottom:'1rem'}}>
                  Hold on… who's trying to open this?<br/>
                  <span style={{fontSize:'.75rem',color:'rgba(242,168,192,.48)'}}>Type your name to continue 👀</span>
                </p>
                <motion.form onSubmit={submit} animate={shake?{x:[-10,10,-7,7,-3,3,0]}:{}} transition={{duration:.42}}
                  style={{display:'flex',flexDirection:'column',gap:'.7rem'}}>
                  <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="your name…" autoFocus
                    style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(242,168,192,.28)',borderRadius:50,padding:'.72rem 1.5rem',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'1.05rem',color:'#faf7f2',outline:'none',textAlign:'center',letterSpacing:'.07em',cursor:'none',transition:'border-color .3s'}}
                    onFocus={e=>e.target.style.borderColor='rgba(242,168,192,.65)'}
                    onBlur={e=>e.target.style.borderColor='rgba(242,168,192,.28)'}
                  />
                  <motion.button type="submit" whileHover={{scale:1.03,boxShadow:'0 0 28px rgba(242,168,192,.2)'}} whileTap={{scale:.96}}
                    style={{background:'rgba(200,96,122,.1)',border:'1px solid rgba(242,168,192,.38)',borderRadius:50,padding:'.68rem 1.5rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.7rem',letterSpacing:'.3em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
                    Continue loading ✦
                  </motion.button>
                </motion.form>
                {hint && <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{marginTop:'.55rem',fontFamily:"'Montserrat',sans-serif",fontSize:'.66rem',fontStyle:'italic',color:'rgba(242,168,192,.4)'}}>Hint: it's your beautiful name 🌸</motion.p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase==='post' && (
          <motion.p initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
            style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'1rem',color:'rgba(242,168,192,.75)',textAlign:'center',lineHeight:1.7}}>
            Welcome, Amruta 🌸<br/>
            <span style={{fontSize:'.78rem',color:'rgba(250,247,242,.3)'}}>Continuing your gift…</span>
          </motion.p>
        )}
      </motion.div>
      <style>{`input::placeholder{color:rgba(250,247,242,.18)}`}</style>
    </motion.div>
  )
}
