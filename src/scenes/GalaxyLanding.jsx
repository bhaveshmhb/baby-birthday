import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function StarField() {
  const ref = useRef(null)
  const mouse = useRef({x:0,y:0})
  useEffect(()=>{
    const cv=ref.current, ctx=cv.getContext('2d')
    const resize=()=>{cv.width=innerWidth;cv.height=innerHeight}
    resize(); window.addEventListener('resize',resize)
    const S=Array.from({length:8000},()=>({
      x:(Math.random()-.5)*3200, y:(Math.random()-.5)*3200, z:Math.random()*2000,
      sz:.3+Math.random()*1.7, spd:.18+Math.random()*.45,
      pink:Math.random()>.82, twph:Math.random()*Math.PI*2, twspd:.018+Math.random()*.045
    }))
    const petals=Array.from({length:35},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vx:(Math.random()-.5)*.35, vy:.25+Math.random()*.6,
      sz:5+Math.random()*9, rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.04, op:.18+Math.random()*.28
    }))
    const onMove=e=>{mouse.current={x:(e.clientX/innerWidth-.5)*2,y:(e.clientY/innerHeight-.5)*2}}
    window.addEventListener('mousemove',onMove)
    let t=0, raf
    const draw=()=>{
      t+=.009; ctx.fillStyle='rgba(0,0,0,.18)'; ctx.fillRect(0,0,cv.width,cv.height)
      const cx=cv.width/2, cy=cv.height/2, mx=mouse.current.x*38, my=mouse.current.y*38
      S.forEach(s=>{
        s.z-=s.spd; s.twph+=s.twspd; if(s.z<=0)s.z=2000
        const pz=s.z/2000, px=s.x/pz+cx+mx*(1-pz), py=s.y/pz+cy+my*(1-pz)
        if(px<0||px>cv.width||py<0||py>cv.height)return
        const sz=s.sz*(1-pz)*2.6, br=.4+.6*Math.abs(Math.sin(s.twph)), a=br*(1-pz*.28)
        ctx.beginPath(); ctx.arc(px,py,Math.max(.15,sz),0,Math.PI*2)
        if(s.pink){ctx.fillStyle=`rgba(242,168,192,${a})`;ctx.shadowBlur=6;ctx.shadowColor='#f2a8c0'}
        else{ctx.fillStyle=`rgba(255,255,255,${a*.75})`;ctx.shadowBlur=0}
        ctx.fill(); ctx.shadowBlur=0
      })
      petals.forEach(p=>{
        p.x+=p.vx+Math.sin(t+p.x*.01)*.4; p.y+=p.vy; p.rot+=p.rs
        if(p.y>cv.height+20){p.y=-20;p.x=Math.random()*cv.width}
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot)
        ctx.beginPath(); ctx.ellipse(0,0,p.sz*.55,p.sz,0,0,Math.PI*2)
        ctx.fillStyle=`rgba(242,168,192,${p.op})`; ctx.fill(); ctx.restore()
      })
      const g=ctx.createRadialGradient(cx+mx*.25,cy+my*.25,0,cx,cy,380)
      g.addColorStop(0,'rgba(200,96,122,.05)'); g.addColorStop(1,'transparent')
      ctx.fillStyle=g; ctx.fillRect(0,0,cv.width,cv.height)
      raf=requestAnimationFrame(draw)
    }
    draw()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('mousemove',onMove)}
  },[])
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>
}

export default function GalaxyLanding({ onContinue }) {
  const [p, setP] = useState(0)
  const [mouse, setMouse] = useState({x:0,y:0})
  useEffect(()=>{
    const ts=[setTimeout(()=>setP(1),2000),setTimeout(()=>setP(2),3600),setTimeout(()=>setP(3),5000)]
    return()=>ts.forEach(clearTimeout)
  },[])
  useEffect(()=>{
    const fn=e=>setMouse({x:(e.clientX/innerWidth-.5)*18,y:(e.clientY/innerHeight-.5)*18})
    window.addEventListener('mousemove',fn); return()=>window.removeEventListener('mousemove',fn)
  },[])

  const name='My Babyyy'
  return (
    <motion.div style={{position:'fixed',inset:0,background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:300,overflow:'hidden'}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:.96}} transition={{duration:1}}>
      <StarField/>
      <motion.div style={{position:'relative',zIndex:10,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.8rem'}}
        animate={{x:mouse.x,y:mouse.y}} transition={{type:'spring',stiffness:75,damping:26}}>
        <motion.p initial={{opacity:0,letterSpacing:'.08em'}} animate={{opacity:p>=0?1:0,letterSpacing:'.42em'}} transition={{delay:.3,duration:1.4}}
          style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'clamp(.58rem,1.8vw,.72rem)',textTransform:'uppercase',color:'rgba(242,168,192,.58)'}}>
          ✦ &nbsp; welcome to the universe made just for &nbsp; ✦
        </motion.p>

        {/* Animated name letters */}
        <div style={{display:'flex',perspective:900,overflow:'visible'}}>
          {name.split('').map((ch,i)=>(
            <motion.span key={i} initial={{opacity:0,y:55,rotateX:-38}} animate={{opacity:1,y:0,rotateX:0}}
              transition={{delay:.1+i*.09,type:'spring',stiffness:95,damping:14}}
              style={{display:'inline-block',fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontStyle:'italic',fontSize:'clamp(3rem,10vw,7rem)',color:'#faf7f2',textShadow:'0 0 60px rgba(242,168,192,.4)',lineHeight:1}}>
              {ch}
            </motion.span>
          ))}
        </div>

        <AnimatePresence>
          {p>=1 && (
            <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:75,damping:20}}
              style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize:'clamp(.95rem,2.8vw,1.25rem)',color:'rgba(250,247,242,.6)',lineHeight:1.85,maxWidth:500}}>
              8th April kane ivattuuu😍🥳 <br/>its the day the world made someone like you just for mee😁🥰.
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {p>=2 && (
            <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:75}}
              style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'clamp(.7rem,2vw,.82rem)',color:'rgba(242,168,192,.45)',letterSpacing:'.12em',fontStyle:'italic'}}>
              and ofcourse our first birthday as young couples💋🫂
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {p>=3 && (
            <motion.button initial={{opacity:0,scale:.82,y:18}} animate={{opacity:1,scale:1,y:0}}
              transition={{type:'spring',stiffness:180,damping:18}}
              whileHover={{scale:1.06,boxShadow:'0 0 55px rgba(200,96,122,.3)'}} whileTap={{scale:.95}}
              onClick={onContinue}
              style={{background:'transparent',border:'1px solid rgba(242,168,192,.42)',borderRadius:50,padding:'1rem 3.2rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.76rem',letterSpacing:'.35em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none',marginTop:'.5rem'}}>
              Lets goooo😌❤️ ✦
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {p>=3 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{position:'absolute',bottom:'2.2rem',display:'flex',flexDirection:'column',alignItems:'center',zIndex:10}}>
            <motion.div animate={{y:[0,9,0]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}
              style={{width:1,height:46,background:'linear-gradient(to bottom,rgba(242,168,192,.55),transparent)'}}/>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
