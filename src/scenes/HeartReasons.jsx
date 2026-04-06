import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── EDIT REASONS ──────────────────────────────────────────────────
const REASONS = [
  { n:'01', title:'That charming smilee', body:'The one that makes me happiest and makes even the hardest days feel survivable.' },
  { n:'02', title:'How you love someone', body:'Fully, quietly, without keeping score. It\'s the rarest thing I\'ve ever seen. and luckiest to get' },
  { n:'03', title:'January 19th', body:'You were brave enough to text me for the first time.. That took everything. I saw it.' },
  { n:'04', title:'Your softness', body:'The way you care me so deeply, so naturally and without even realising you\'re doing it.' },
  { n:'05', title:'Those little things', body:'Every small detail about you that you think goes unnoticed. I notice all of it.' },
  { n:'06', title:'Simply Ninuu', body:'The world is genuinely better for me because you are in it. That\'s not a small thing.' },
]
// ─────────────────────────────────────────────────────────────────

function HeartCanvas({ onExplode, exploded }) {
  const ref = useRef(null)
  const rafRef = useRef(null)
  const ptRef = useRef([])
  const explodedRef = useRef(false)

  useEffect(()=>{
    const cv=ref.current, ctx=cv.getContext('2d')
    cv.width=420; cv.height=420
    const cx=210, cy=205, B=88
    const hx=t=>cx+B*16*Math.sin(t)**3
    const hy=t=>cy-B*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))

    const initPt=()=>{
      ptRef.current=Array.from({length:260},()=>{
        const t=Math.random()*Math.PI*2, r=B*(.5+Math.random()*.5)
        const px=hx(t*(r/B)), py=hy(t*(r/B))
        const ang=Math.atan2(py-cy,px-cx), spd=3.5+Math.random()*9
        return { x:px,y:py,vx:Math.cos(ang)*spd+(Math.random()-.5)*2.5,vy:Math.sin(ang)*spd+(Math.random()-.5)*2.5,
          sz:2+Math.random()*5.5,color:['#f2a8c0','#e8849a','#fce4ec','#fff','#ffd6e7','#f48fb1'][Math.floor(Math.random()*6)],
          life:1,decay:.01+Math.random()*.007,grav:.06+Math.random()*.04,phase:'out',tx:px,ty:py }
      })
    }
    initPt()

    let t=0, reform=0
    const draw=()=>{
      t+=.013; ctx.clearRect(0,0,420,420)
      if(!explodedRef.current){
        const beat=(Math.sin(t*2)+1)/2, sc=1+beat*.065
        const g=ctx.createRadialGradient(cx,cy-10,0,cx,cy-10,B*sc*2.4)
        g.addColorStop(0,'rgba(200,96,122,.16)'); g.addColorStop(1,'transparent')
        ctx.fillStyle=g; ctx.fillRect(0,0,420,420)
        ctx.beginPath()
        for(let i=0;i<=300;i++){const a=(i/300)*Math.PI*2;const x=hx(a),y=hy(a);i===0?ctx.moveTo(x*sc+(cx*(1-sc)),y*sc+(cy*(1-sc))):ctx.lineTo(x*sc+(cx*(1-sc)),y*sc+(cy*(1-sc)))}
        ctx.closePath()
        const hg=ctx.createRadialGradient(cx-22,cy-32,0,cx,cy,B*sc*1.35)
        hg.addColorStop(0,'rgba(255,175,195,.95)'); hg.addColorStop(.45,'rgba(200,96,122,.9)'); hg.addColorStop(1,'rgba(140,40,70,.82)')
        ctx.fillStyle=hg; ctx.fill()
        ctx.beginPath()
        ctx.ellipse(cx-24,cy-34,18,27,-Math.PI/4,0,Math.PI*2)
        ctx.fillStyle='rgba(255,255,255,.22)'; ctx.fill()
        ctx.strokeStyle='rgba(255,150,175,.28)'; ctx.lineWidth=1
        ctx.beginPath()
        for(let i=0;i<=300;i++){const a=(i/300)*Math.PI*2;const x=hx(a),y=hy(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}
        ctx.closePath(); ctx.stroke()
      } else {
        reform++
        ptRef.current.forEach(p=>{
          if(p.phase==='out'){
            p.x+=p.vx; p.y+=p.vy; p.vy+=p.grav; p.vx*=.99; p.life-=p.decay
            if(p.life<=0){p.phase='in';p.life=0}
          } else if(reform>80){
            p.x+=(p.tx-p.x)*.09; p.y+=(p.ty-p.y)*.09; p.life=Math.min(1,p.life+.045)
          }
          ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*Math.max(0,p.life),0,Math.PI*2)
          ctx.fillStyle=p.color; ctx.globalAlpha=p.life*.88; ctx.fill(); ctx.globalAlpha=1
        })
        if(reform>170 && ptRef.current.every(p=>Math.abs(p.x-p.tx)<3&&Math.abs(p.y-p.ty)<3)){
          explodedRef.current=false; reform=0
        }
      }
      rafRef.current=requestAnimationFrame(draw)
    }
    draw(); initPt()

    const onClick=()=>{ if(!explodedRef.current){ explodedRef.current=true; reform=0; initPt(); onExplode() } }
    cv.addEventListener('click',onClick)
    return()=>{cancelAnimationFrame(rafRef.current);cv.removeEventListener('click',onClick)}
  },[])

  return (
    <canvas ref={ref} style={{width:'min(340px,76vw)',height:'min(340px,76vw)',cursor:'none',filter:'drop-shadow(0 0 35px rgba(200,96,122,.45))'}}/>
  )
}

// Card stack — cards slide in from bottom, user taps through
function ReasonCards({ onAllDone }) {
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState([0])

  const next = () => {
    if(current < REASONS.length-1){
      const nx=current+1
      setCurrent(nx)
      setRevealed(r=>[...r,nx])
    } else {
      onAllDone()
    }
  }

  return (
    <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:90,damping:18}}
      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.4rem',maxWidth:480,width:'100%',padding:'0 1.5rem'}}>

      {/* Card stack display */}
      <div style={{position:'relative',width:'100%',height:180}}>
        {REASONS.map((r,i)=>{
          const isActive=i===current
          const isPast=i<current
          const isVisible=revealed.includes(i)
          if(!isVisible)return null
          return (
            <motion.div key={r.n}
              initial={{opacity:0,y:40,scale:.92,rotateX:-15}}
              animate={{opacity:isPast?.3:1, y:isPast?-8:0, scale:isPast?.97:1, rotateX:0, zIndex:isActive?10:i}}
              transition={{type:'spring',stiffness:130,damping:18}}
              style={{
                position:'absolute',inset:0,
                background: isActive
                  ? 'linear-gradient(135deg,rgba(200,96,122,.18),rgba(242,168,192,.08))'
                  : 'rgba(255,255,255,.03)',
                border:`1px solid rgba(242,168,192,${isActive?.35:.1})`,
                borderRadius:20, padding:'1.8rem 2rem',
                backdropFilter:'blur(12px)',
              }}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'1rem'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.8rem',fontWeight:300,color:'rgba(200,96,122,.22)',lineHeight:1,flexShrink:0}}>{r.n}</span>
                <div>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:'clamp(1rem,2.8vw,1.2rem)',color:'#faf7f2',marginBottom:'.5rem',letterSpacing:'.02em'}}>{r.title}</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize:'clamp(.88rem,2.3vw,1rem)',color:'rgba(250,247,242,.7)',lineHeight:1.75}}>{r.body}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Progress + button */}
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {REASONS.map((_,i)=>(
          <motion.div key={i} animate={{width:i===current?20:5,background:i===current?'#f2a8c0':i<current?'rgba(242,168,192,.45)':'rgba(242,168,192,.18)'}} transition={{type:'spring',stiffness:280,damping:24}} style={{height:5,borderRadius:3}}/>
        ))}
      </div>

      <motion.button whileHover={{scale:1.05,boxShadow:'0 0 40px rgba(200,96,122,.25)'}} whileTap={{scale:.95}} onClick={next}
        style={{background:'rgba(200,96,122,.1)',border:'1px solid rgba(242,168,192,.4)',borderRadius:50,padding:'.78rem 2.4rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.7rem',letterSpacing:'.3em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
        {current<REASONS.length-1 ? 'Next reason ♡' : 'I felt it ♡'}
      </motion.button>
    </motion.div>
  )
}

export default function HeartReasons({ onContinue }) {
  const [exploded, setExploded] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [allDone, setAllDone] = useState(false)

  const handleExplode = () => {
    setExploded(true)
    setTimeout(()=>setShowCards(true), 600)
  }

  return (
    <motion.div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 50%,#200810 0%,#000 70%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',zIndex:300,gap:'1.5rem',padding:'1.5rem'}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}}>

      {!showCards && (
        <motion.div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.2rem'}}>
          <motion.p initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{delay:.4}}
            style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.65rem',letterSpacing:'.42em',textTransform:'uppercase',color:'rgba(242,168,192,.52)'}}>
            ✦ &nbsp; tap the heart &nbsp; ✦
          </motion.p>
          <motion.h2 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.6}}
            style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:'italic',fontSize:'clamp(1.7rem,4.8vw,2.5rem)',color:'#faf7f2'}}>
            What you mean to me
          </motion.h2>
          <HeartCanvas onExplode={handleExplode} exploded={exploded}/>
          <motion.p initial={{opacity:0}} animate={{opacity:[0,.5,0]}} transition={{delay:2,duration:2.5,repeat:Infinity}}
            style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.6rem',color:'rgba(242,168,192,.38)',letterSpacing:'.18em',fontStyle:'italic'}}>
            click the heart to reveal…
          </motion.p>
        </motion.div>
      )}

      <AnimatePresence>
        {showCards && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.5rem',width:'100%'}}>
            <motion.h2 initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
              style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:'italic',fontSize:'clamp(1.5rem,4vw,2.2rem)',color:'#faf7f2',textAlign:'center'}}>
              Every single reason ♡
            </motion.h2>
            <ReasonCards onAllDone={()=>setAllDone(true)}/>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allDone && (
          <motion.button initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:100}}
            whileHover={{scale:1.05,boxShadow:'0 0 45px rgba(200,96,122,.25)'}} whileTap={{scale:.95}}
            onClick={onContinue}
            style={{background:'transparent',border:'1px solid rgba(242,168,192,.42)',borderRadius:50,padding:'.85rem 2.8rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.73rem',letterSpacing:'.3em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
            There's more ♡
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
