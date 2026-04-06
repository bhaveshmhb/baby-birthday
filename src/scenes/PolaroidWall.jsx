import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── ADD YOUR PHOTOS ──────────────────────────────────────────────
// Upload photos to GitHub, get the raw URL, replace null below.
// Example: 'https://raw.githubusercontent.com/bhavesh/amruta/main/pic1.jpg'
const POLAROIDS = [
  { id:1, img:'https://raw.githubusercontent.com/bhaveshmhb/baby-birthday/main/charming%20smile%20.jpeg', front:'That smile 🌸', back:'The one that gets me every single time.', rot:-7, ox:-300, oy:-130 },
  { id:2, img:'https://raw.githubusercontent.com/bhaveshmhb/baby-birthday/main/babyy.jpeg', front:'My baby 🥹', back:'I could look at this forever.', rot:4, ox:0, oy:-170 },
  { id:3, img:'https://raw.githubusercontent.com/bhaveshmhb/baby-birthday/main/my%20fav.jpeg', front:'My favourite ♡', back:'This one lives in my heart.', rot:-2, ox:305, oy:-120 },
  { id:4, img:'https://raw.githubusercontent.com/bhaveshmhb/baby-birthday/main/akward.jpeg', front:'Even awkward = cute 😭', back:'You make everything adorable.', rot:6, ox:-195, oy:148 },
  { id:5, img:'https://raw.githubusercontent.com/bhaveshmhb/baby-birthday/main/passport.jpeg', front:'Always beautiful 🌷', back:'Every single version of you.', rot:-4, ox:195, oy:155 },
  { id:6, img:'https://raw.githubusercontent.com/bhaveshmhb/baby-birthday/main/wallpaper.jpeg', front:'My wallpaper ♡', back:'Where else would you be?', rot:8, ox:0, oy:180 },
]
// ─────────────────────────────────────────────────────────────────

function Polaroid({ p, flipped, onFlip }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      style={{position:'absolute',left:'50%',top:'50%',width:172,zIndex:hov||flipped?20:p.id,cursor:'none',perspective:1100}}
      initial={{opacity:0,scale:0,rotate:p.rot*3,x:(Math.random()-.5)*innerWidth,y:(Math.random()-.5)*innerHeight}}
      animate={{opacity:1,scale:1,rotate:hov?0:p.rot,x:p.ox-86,y:p.oy-106}}
      transition={{delay:p.id*.14,type:'spring',stiffness:78,damping:17}}
      whileHover={{scale:1.09,zIndex:30,transition:{type:'spring',stiffness:300,damping:20}}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      onClick={()=>onFlip(p.id)}
      drag dragElastic={.14} dragMomentum
    >
      <motion.div animate={{rotateY:flipped?180:0}} transition={{type:'spring',stiffness:115,damping:17}} style={{transformStyle:'preserve-3d',position:'relative'}}>
        {/* Front */}
        <div style={{backfaceVisibility:'hidden',background:'#faf7f2',padding:'11px 11px 38px',boxShadow:hov?'0 28px 75px rgba(0,0,0,.65),0 0 28px rgba(200,96,122,.14)':'0 14px 38px rgba(0,0,0,.52)',transition:'box-shadow .3s'}}>
          <div style={{width:'100%',height:152,background:p.img?`url(${p.img}) center/cover no-repeat`:'linear-gradient(135deg,rgba(242,168,192,.5),rgba(200,96,122,.2))',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
            {!p.img&&<div style={{textAlign:'center',opacity:.4}}>
              <div style={{fontSize:'2.2rem',marginBottom:4}}>📸</div>
              <p style={{fontFamily:"'Montserrat',sans-serif",fontSize:'.56rem',letterSpacing:'.2em',color:'#c07090',textTransform:'uppercase'}}>Add photo</p>
            </div>}
          </div>
          <div style={{paddingTop:7,textAlign:'center'}}>
            <p style={{fontFamily:"'Dancing Script',cursive",fontSize:'.9rem',color:'#3a1a2a',lineHeight:1.3}}>{p.front}</p>
          </div>
        </div>
        {/* Back */}
        <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',transform:'rotateY(180deg)',background:'#faf7f2',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'1.4rem',boxShadow:'0 18px 55px rgba(0,0,0,.5)'}}>
          <div style={{width:28,height:1,background:'rgba(200,96,122,.45)',marginBottom:'1rem'}}/>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'.82rem',color:'#3a1a2a',textAlign:'center',lineHeight:1.65,marginBottom:'.7rem'}}>{p.front}</p>
          <p style={{fontFamily:"'Montserrat',sans-serif",fontSize:'.62rem',fontWeight:300,color:'rgba(58,26,42,.52)',textAlign:'center',letterSpacing:'.07em'}}>{p.back}</p>
          <div style={{width:28,height:1,background:'rgba(200,96,122,.45)',marginTop:'1rem'}}/>
        </div>
      </motion.div>
      {/* tape */}
      <div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%) rotate(-2deg)',width:46,height:18,background:'rgba(255,230,240,.32)',backdropFilter:'blur(2px)',zIndex:5}}/>
    </motion.div>
  )
}

export default function PolaroidWall({ onContinue }) {
  const [flipped, setFlipped] = useState(new Set())
  const toggle = id => setFlipped(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })

  return (
    <motion.div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 30% 65%,#180a12 0%,#000 70%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',zIndex:300}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}}>
      <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(242,168,192,.012) 48px,rgba(242,168,192,.012) 49px)',pointerEvents:'none'}}/>

      <motion.div initial={{opacity:0,y:-26}} animate={{opacity:1,y:0}} transition={{delay:.5,type:'spring',stiffness:80}}
        style={{position:'absolute',top:'2.8rem',textAlign:'center',zIndex:10}}>
        <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.65rem',letterSpacing:'.38em',textTransform:'uppercase',color:'rgba(242,168,192,.52)',marginBottom:'.4rem'}}>✦ tap to flip ✦</p>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:'italic',fontSize:'clamp(1.7rem,4.8vw,2.6rem)',color:'#faf7f2',textShadow:'0 0 38px rgba(242,168,192,.18)'}}>Our Moments</h2>
      </motion.div>

      <div style={{position:'relative',width:0,height:0,zIndex:5}}>
        {POLAROIDS.map((p,i)=><Polaroid key={p.id} p={p} flipped={flipped.has(p.id)} onFlip={toggle}/>)}
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
        style={{position:'absolute',bottom:'2.2rem',textAlign:'center',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
        <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:'.68rem',color:'rgba(250,247,242,.25)',letterSpacing:'.14em',fontStyle:'italic'}}>drag them · flip them · they're all yours</p>
        <motion.button whileHover={{scale:1.05,boxShadow:'0 0 45px rgba(200,96,122,.22)'}} whileTap={{scale:.96}} onClick={onContinue}
          style={{background:'transparent',border:'1px solid rgba(242,168,192,.32)',borderRadius:50,padding:'.78rem 2.4rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.7rem',letterSpacing:'.28em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
          Continue ♡
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
