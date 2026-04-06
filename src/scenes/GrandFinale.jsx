import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── EDIT THESE ────────────────────────────────────────────────────
const MESSAGE = [
  "Konegu ond varsha doddol agbitte alvaa.",
  "But still you are a small paapu in my eyes",
  "I am missing that feeling of celebrating this birthday physically with you and starting your year with a passionate kissi..",
  "But it's fine as that distance can never stop us from loving each other more and more every day.",
  "",
  "Happy birthdayy, my love.",
  "Wishing you a year ahead as beautiful, kind and inspiring as you are. I hope you achieve everything you wish for and more, because you deserve the world and beyond.",
  "Your boy is always proud of you and always choose to love youu...",
]

const FINAL = [
  "I tried my level best",
  "to make this day special for you, just like you make every day special for me.",
  "",
  "And nang gottilla ning ista aayto ilvo anta ",
  "whether I was successful or not.",
  "",
  "But even if I failed to make you speical this day..",
  "it was never because of lack of love or something like that ,",
  "Just a lack of options I could do to make your day a memorable one.",
  "",
  "I always want to love you",
  "with this same intensity.",
  "",
  "I hope I made you smile todayy.. ♡",
]
// ─────────────────────────────────────────────────────────────────

// Confetti canvas
function Confetti({ burst }) {
  const cvRef = useRef(null)
  const pieces = useRef([])
  const rafRef = useRef(null)
  const COLORS = ['#f2a8c0','#e8849a','#fce4ec','#ffd6e7','#fff','#f48fb1','#c8607a']

  const spawnBurst = () => {
    const cx=innerWidth/2, cy=innerHeight*.36
    for(let i=0;i<220;i++){
      const a=Math.random()*Math.PI*2, sp=4+Math.random()*13
      pieces.current.push({x:cx+(Math.random()-.5)*80,y:cy+(Math.random()-.5)*40,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-5,w:3+Math.random()*9,h:6+Math.random()*14,color:COLORS[Math.floor(Math.random()*COLORS.length)],rot:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.16,op:1,grav:.16+Math.random()*.09,shape:Math.random()>.55?'rect':Math.random()>.5?'circle':'heart'})
    }
  }
  useEffect(()=>{if(burst)spawnBurst()},[burst])

  useEffect(()=>{
    const cv=cvRef.current, ctx=cv.getContext('2d')
    const resize=()=>{cv.width=innerWidth;cv.height=innerHeight}
    resize(); window.addEventListener('resize',resize)
    for(let i=0;i<55;i++) pieces.current.push({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight,vx:(Math.random()-.5)*.55,vy:.55+Math.random()*1.1,w:3+Math.random()*7,h:6+Math.random()*12,color:COLORS[Math.floor(Math.random()*COLORS.length)],rot:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.038,op:.65+Math.random()*.35,grav:.008,shape:'rect',ambient:true})

    const dh=(ctx,s)=>{ctx.beginPath();ctx.moveTo(0,s*.22);ctx.bezierCurveTo(0,-s*.1,-s,-s*.1,-s,s*.32);ctx.bezierCurveTo(-s,s*.72,0,s,0,s*1.12);ctx.bezierCurveTo(0,s,s,s*.72,s,s*.32);ctx.bezierCurveTo(s,-s*.1,0,-s*.1,0,s*.22);ctx.fill()}

    const draw=()=>{
      ctx.clearRect(0,0,cv.width,cv.height)
      pieces.current=pieces.current.filter(p=>p.op>0.015)
      pieces.current.forEach(p=>{
        p.x+=p.vx+Math.sin(p.y*.011)*.28; p.y+=p.vy; p.vy+=p.grav; p.rot+=p.rs
        if(!p.ambient){p.op-=.0035;p.vx*=.992}
        else if(p.y>cv.height+25){p.y=-20;p.x=Math.random()*cv.width;p.vy=.55+Math.random()*1.1}
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=p.op; ctx.fillStyle=p.color
        if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill()}
        else if(p.shape==='heart') dh(ctx,p.w*.38)
        else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h)
        ctx.globalAlpha=1; ctx.restore()
      })
      rafRef.current=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener('resize',resize)}
  },[])

  return <canvas ref={cvRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1}}/>
}

function Lantern({x,delay,dur}){
  return (
    <motion.div style={{position:'absolute',left:`${x}%`,bottom:-75,width:26,height:40,pointerEvents:'none',zIndex:2}}
      initial={{y:0,opacity:.85}} animate={{y:-(innerHeight+110),opacity:[.85,.85,0]}}
      transition={{duration:dur,delay,ease:'easeOut',repeat:Infinity,repeatDelay:3+Math.random()*4}}>
      <div style={{width:'100%',height:'78%',background:'radial-gradient(ellipse,rgba(255,200,88,.9),rgba(255,125,45,.68))',borderRadius:'40% 40% 30% 30%',boxShadow:'0 0 16px rgba(255,170,65,.62),0 0 45px rgba(255,125,45,.22)'}}>
        <div style={{position:'absolute',top:'38%',left:'50%',transform:'translate(-50%,-50%)',width:'52%',height:'52%',background:'rgba(255,222,122,.72)',borderRadius:'50%',filter:'blur(4px)'}}/>
      </div>
      <div style={{width:1,height:'22%',background:'rgba(200,148,78,.48)',margin:'0 auto'}}/>
    </motion.div>
  )
}

// Typewriter for arrays of strings
function TypeLines({ lines, onDone }) {
  const [done, setDone] = useState([])
  const [curLine, setCurLine] = useState(0)
  const [curChar, setCurChar] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(()=>{
    if(curLine>=lines.length){setFinished(true);onDone?.();return}
    const line=lines[curLine]
    if(curChar<line.length){
      const t=setTimeout(()=>setCurChar(c=>c+1),55+Math.random()*28)
      return()=>clearTimeout(t)
    } else {
      const t=setTimeout(()=>{setDone(p=>[...p,line]);setCurChar(0);setCurLine(l=>l+1)},line===''?260:520)
      return()=>clearTimeout(t)
    }
  },[curLine,curChar,lines])

  const typing = curLine<lines.length ? lines[curLine].slice(0,curChar) : ''

  return (
    <div style={{maxWidth:460,textAlign:'center'}}>
      {done.map((l,i)=>(
        <p key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'clamp(.9rem,2.5vw,1.08rem)',color:l===''?'transparent':'rgba(250,247,242,.82)',lineHeight:l===''?'.65':'1.88',margin:0,minHeight:l===''?'.72rem':'auto'}}>{l||'\u00A0'}</p>
      ))}
      {!finished && (
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'clamp(.9rem,2.5vw,1.08rem)',color:'rgba(250,247,242,.82)',lineHeight:'1.88',margin:0}}>
          {typing}<motion.span animate={{opacity:[1,0]}} transition={{duration:.5,repeat:Infinity}} style={{color:'#c8607a',fontStyle:'normal'}}>|</motion.span>
        </p>
      )}
    </div>
  )
}

// Hold-to-hug button
function HugButton({ onComplete }) {
  const [holding, setHolding] = useState(false)
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const iRef = useRef(null)
  const HOLD = 2400

  const start = useCallback(()=>{
    if(done)return; setHolding(true)
    const t0=Date.now()
    iRef.current=setInterval(()=>{
      const p=Math.min(((Date.now()-t0)/HOLD)*100,100); setPct(p)
      if(p>=100){clearInterval(iRef.current);setDone(true);setHolding(false);onComplete()}
    },16)
  },[done,onComplete])
  const stop=useCallback(()=>{if(done)return;clearInterval(iRef.current);setHolding(false);setPct(0)},[done])

  return (
    <motion.div initial={{opacity:0,y:18,scale:.88}} animate={{opacity:1,y:0,scale:1}} transition={{type:'spring',stiffness:100,damping:18}}
      style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.55rem'}}>
      <motion.button
        onMouseDown={start} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop}
        animate={done?{scale:1.08}:holding?{scale:1.05}:{scale:1}} transition={{type:'spring',stiffness:280,damping:20}}
        style={{position:'relative',overflow:'hidden',width:'clamp(210px,52vw,290px)',padding:'1.1rem 2rem',background:done?'rgba(200,96,122,.2)':'rgba(200,96,122,.08)',border:`1px solid rgba(242,168,192,${done?.62:.36})`,borderRadius:60,fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.76rem',letterSpacing:'.24em',textTransform:'uppercase',color:done?'#faf7f2':'#f2a8c0',cursor:'none',userSelect:'none',boxShadow:done?'0 0 55px rgba(200,96,122,.32)':holding?'0 0 35px rgba(200,96,122,.18)':'none',transition:'box-shadow .3s,background .3s'}}>
        <motion.div style={{position:'absolute',left:0,top:0,bottom:0,background:'linear-gradient(90deg,rgba(200,96,122,.28),rgba(242,168,192,.38))',borderRadius:60,transformOrigin:'left'}} animate={{width:`${pct}%`}} transition={{duration:.016,ease:'linear'}}/>
        <span style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'.55rem'}}>
          <motion.span animate={holding?{scale:[1,1.3,1],rotate:[0,-10,10,0]}:{}} transition={{duration:.5,repeat:Infinity}} style={{fontSize:'1.05rem'}}>{done?'🫂':'🤗'}</motion.span>
          {done?'Hug sent! ♡':holding?'Sending hug…':'Hold to send a hug'}
        </span>
      </motion.button>
      {!done&&<p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.58rem',color:'rgba(250,247,242,.18)',letterSpacing:'.14em',fontStyle:'italic'}}>hold until the hug reaches her 🌸</p>}
    </motion.div>
  )
}

const LANTERNS=Array.from({length:10},(_,i)=>({x:5+i*9+Math.random()*4,delay:i*1.3,dur:9+Math.random()*5}))

export default function GrandFinale() {
  const [ph, setPh] = useState(0)
  // 0=name+msg, 1=hug appears, 2=hug done, 3=celebration, 4=final msg, 5=heart only
  const [burst, setBurst] = useState(false)
  const [fadeAll, setFadeAll] = useState(false)

  // Phase 0 → show name, start typing message
  // Hug button appears ONLY when message finishes typing (ph=1)
  // After hug → celebration → final message → fade to heart

  useEffect(()=>{setTimeout(()=>setPh(0),400)},[])

  const onMsgDone=()=>{ setTimeout(()=>setPh(1), 600) }

  const onHug=()=>{
    setBurst(true); setPh(2)
    setTimeout(()=>setPh(3),2200)
    setTimeout(()=>setPh(4),4500)
  }

  const onFinalDone=()=>{
    setTimeout(()=>{
      setFadeAll(true)
      setTimeout(()=>setPh(5),1800)
    },1200)
  }

  // Pure heart ending
  if(ph===5){
    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2}}
        style={{position:'fixed',inset:0,background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:300}}>
        <motion.div
          initial={{opacity:0,scale:.5}}
          animate={{opacity:1,scale:1}}
          transition={{type:'spring',stiffness:80,damping:14,delay:.5}}
          style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.2rem'}}>
          <motion.p initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:1.2}}
            style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize:'clamp(.9rem,2.5vw,1.1rem)',color:'rgba(242,168,192,.55)',letterSpacing:'.08em',textAlign:'center'}}>
            from love, with love, for love
          </motion.p>
          <motion.div
            animate={{scale:[1,1.32,1,1.14,1]}}
            transition={{duration:1.42,repeat:Infinity,ease:'easeInOut'}}
            style={{fontSize:'clamp(4rem,15vw,7rem)',lineHeight:1,filter:'drop-shadow(0 0 28px #c8607a) drop-shadow(0 0 60px rgba(200,96,122,.4))'}}>
            ❤️
          </motion.div>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
            style={{fontFamily:"'Dancing Script',cursive",fontSize:'clamp(1rem,3vw,1.4rem)',color:'rgba(200,96,122,.55)'}}>
            — Bhavesh
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 32%,#280d1c 0%,#0a0408 55%,#000 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',zIndex:300,gap:'1.5rem',padding:'2rem'}}
      initial={{opacity:0}} animate={{opacity:fadeAll?.4:1}} transition={{duration:fadeAll?2:1.5}}>
      <Confetti burst={burst}/>
      {LANTERNS.map((l,i)=><Lantern key={i} {...l}/>)}

      {ph>=3&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,rgba(200,96,122,.1) 0%,transparent 70%)',pointerEvents:'none',zIndex:3}}/>}

      <div style={{position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',gap:'1.5rem',textAlign:'center',width:'100%'}}>

        {/* Big name — only show pre-finale */}
        {ph<4 && (
          <motion.div initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:88,damping:14}}>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontStyle:'italic',fontSize:'clamp(2.8rem,9vw,5.8rem)',color:'#faf7f2',lineHeight:1,animation:'nameGlow 3s ease-in-out infinite'}}>Amruta</h1>
          </motion.div>
        )}

        {/* Divider */}
        {ph<4 && (
          <motion.div initial={{opacity:0,scaleX:0}} animate={{opacity:1,scaleX:1}} transition={{type:'spring',stiffness:120}}
            style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{width:48,height:1,background:'linear-gradient(to right,transparent,rgba(242,168,192,.48))'}}/>
            <motion.span animate={{scale:[1,1.28,1]}} transition={{duration:1.42,repeat:Infinity}} style={{color:'#f2a8c0',fontSize:'1.05rem'}}>♡</motion.span>
            <div style={{width:48,height:1,background:'linear-gradient(to left,transparent,rgba(242,168,192,.48))'}}/>
          </motion.div>
        )}

        {/* Main message — typing */}
        {ph<4 && ph!==3 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>
            <TypeLines lines={MESSAGE} onDone={onMsgDone}/>
          </motion.div>
        )}

        {/* HUG BUTTON — appears only after message finishes */}
        <AnimatePresence>
          {ph===1 && <HugButton onComplete={onHug}/>}
        </AnimatePresence>

        {/* Post-hug */}
        <AnimatePresence>
          {ph===2||ph===3 ? (
            <motion.div initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{type:'spring',stiffness:120,damping:16}} style={{textAlign:'center'}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'clamp(1.1rem,3.5vw,1.55rem)',color:'#faf7f2',textShadow:'0 0 38px rgba(242,168,192,.38)'}}>Hug received 🫂</p>
              <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:'.78rem',color:'rgba(242,168,192,.52)',marginTop:'.4rem',letterSpacing:'.05em'}}>felt through every pixel of this screen 🌸</p>
            </motion.div>
          ):null}
        </AnimatePresence>

        {/* FINAL message */}
        <AnimatePresence>
          {ph>=4 && (
            <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:70,damping:18}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.4rem'}}>
              <div style={{width:38,height:1,background:'linear-gradient(to right,transparent,rgba(242,168,192,.38),transparent)'}}/>
              <TypeLines lines={FINAL} onDone={onFinalDone}/>
              <div style={{width:38,height:1,background:'linear-gradient(to right,transparent,rgba(242,168,192,.38),transparent)'}}/>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:14}}
                style={{fontFamily:"'Dancing Script',cursive",fontSize:'clamp(1.1rem,3vw,1.5rem)',color:'rgba(200,96,122,.62)'}}>— Bhavesh ♡</motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes nameGlow{0%,100%{text-shadow:0 0 75px rgba(242,168,192,.38),0 0 150px rgba(200,96,122,.14)}50%{text-shadow:0 0 110px rgba(242,168,192,.65),0 0 220px rgba(200,96,122,.28)}}`}</style>
    </motion.div>
  )
}
