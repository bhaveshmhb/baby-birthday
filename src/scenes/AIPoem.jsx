import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── EDIT POEM ─────────────────────────────────────────────────────
const LINES = [
  "In the quiet between heartbeats,",
  "there is a name the universe keeps —",
  "Amruta.",
  "",
  "You walk like you were made",
  "from the softest parts of dawn,",
  "from the sound rain makes",
  "before anyone else is awake.",
  "",
  "The world is measurably kinder",
  "because you are in it.",
  "Every star tonight burns a little brighter",
  "in your honour.",
  "",
  "You came into this world on April 8th",
  "and into my life on December 13th —",
  "both days the universe got something right.",
  "",
  "Happy Birthday, love.",
  "May this year hold every beautiful thing",
  "you so quietly deserve.",
]
// ─────────────────────────────────────────────────────────────────

export default function AIPoem({ onContinue }) {
  const [started, setStarted] = useState(false)
  const [lines, setLines] = useState([])
  const [cur, setCur] = useState('')
  const [li, setLi] = useState(0)
  const [ci, setCi] = useState(0)
  const [done, setDone] = useState(false)
  const [showCont, setShowCont] = useState(false)
  const [gen, setGen] = useState(false)
  const scrollRef = useRef(null)

  useEffect(()=>{
    if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight
  },[lines,cur])

  useEffect(()=>{
    if(!gen)return
    if(li>=LINES.length){setGen(false);setDone(true);setTimeout(()=>setShowCont(true),1800);return}
    const line=LINES[li]
    if(ci<line.length){
      const t=setTimeout(()=>{setCur(p=>p+line[ci]);setCi(c=>c+1)},50+Math.random()*28)
      return()=>clearTimeout(t)
    } else {
      const t=setTimeout(()=>{setLines(p=>[...p,cur]);setCur('');setCi(0);setLi(i=>i+1)},line===''?230:460)
      return()=>clearTimeout(t)
    }
  },[gen,li,ci])

  const restart=()=>{ setLines([]);setCur('');setLi(0);setCi(0);setDone(false);setShowCont(false);setTimeout(()=>setGen(true),200) }

  return (
    <motion.div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 42% 32%,#160810 0%,#000 65%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',zIndex:300,padding:'2rem'}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}}>

      {/* bg glows */}
      {[{top:'18%',left:'12%'},{bottom:'22%',right:'8%'}].map((s,i)=>(
        <motion.div key={i} style={{position:'absolute',width:280,height:280,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(200,96,122,.06),transparent)',pointerEvents:'none',...s}}
          animate={{scale:[1,1.22,1],opacity:[.5,1,.5]}} transition={{duration:5+i*2,repeat:Infinity,ease:'easeInOut',delay:i*2}}/>
      ))}
      <div style={{position:'absolute',top:'10%',left:'5%',fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(4.5rem,11vw,8rem)',fontStyle:'italic',color:'rgba(200,96,122,.04)',pointerEvents:'none',userSelect:'none',lineHeight:1}}>❝</div>
      <div style={{position:'absolute',bottom:'10%',right:'5%',fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(4.5rem,11vw,8rem)',fontStyle:'italic',color:'rgba(200,96,122,.04)',pointerEvents:'none',userSelect:'none',lineHeight:1}}>❞</div>

      {/* Header — no big "Happy Birthday" heading */}
      <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} style={{textAlign:'center',marginBottom:'1.4rem',position:'relative',zIndex:5}}>
        <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:'.62rem',letterSpacing:'.45em',textTransform:'uppercase',color:'rgba(242,168,192,.52)',marginBottom:'.42rem'}}>✦ &nbsp; written just for you &nbsp; ✦</p>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:400,fontStyle:'italic',fontSize:'clamp(1.5rem,4vw,2.1rem)',color:'#faf7f2'}}>A Poem for Amruta</h2>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.8}}
          style={{fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:'.68rem',fontStyle:'italic',color:'rgba(242,168,192,.38)',marginTop:'.5rem',letterSpacing:'.04em',maxWidth:380}}>
          I asked Evoq AI to put into words what I feel for you —<br/>because my own words weren't enough to describe my babyy 🌸
        </motion.p>
      </motion.div>

      {/* Poem area — fixed height, scrollable */}
      <div style={{position:'relative',zIndex:5,width:'100%',maxWidth:520}}>
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div key="pre" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{textAlign:'center',paddingTop:'1.5rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.2rem'}}>
              <motion.div animate={{y:[0,-6,0]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}} style={{fontSize:'2.2rem'}}>🪶</motion.div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'1rem',color:'rgba(250,247,242,.32)'}}>A poem is waiting to be born for you…</p>
              <motion.button whileHover={{scale:1.05,boxShadow:'0 0 45px rgba(200,96,122,.22)'}} whileTap={{scale:.96}}
                onClick={()=>{setStarted(true);setGen(true)}}
                style={{background:'rgba(200,96,122,.08)',border:'1px solid rgba(242,168,192,.35)',borderRadius:50,padding:'.95rem 2.6rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.73rem',letterSpacing:'.33em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
                ✦ Write my poem ✦
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="poem" ref={scrollRef} initial={{opacity:0}} animate={{opacity:1}}
              style={{maxHeight:'42vh',overflowY:'auto',paddingRight:'.4rem',scrollbarWidth:'none'}}>
              {lines.map((l,i)=>(
                <motion.p key={i} initial={{opacity:0}} animate={{opacity:1}}
                  style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,fontSize:'clamp(.88rem,2.3vw,1.08rem)',color:l===''?'transparent':'rgba(250,247,242,.84)',lineHeight:l===''?'.65':'1.9',margin:0,minHeight:l===''?'.72rem':'auto'}}>
                  {l||'\u00A0'}
                </motion.p>
              ))}
              {gen && (
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'clamp(.88rem,2.3vw,1.08rem)',color:'rgba(250,247,242,.84)',lineHeight:'1.9',margin:0}}>
                  {cur}<motion.span animate={{opacity:[1,0]}} transition={{duration:.5,repeat:Infinity}} style={{color:'#c8607a',fontStyle:'normal'}}>|</motion.span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons — ALWAYS below poem, never overlapping */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.4}}
            style={{marginTop:'2rem',display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',position:'relative',zIndex:5}}>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:.96}} onClick={restart}
              style={{background:'transparent',border:'1px solid rgba(242,168,192,.18)',borderRadius:50,padding:'.62rem 1.5rem',fontFamily:"'Montserrat',sans-serif",fontWeight:300,fontSize:'.66rem',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(242,168,192,.48)',cursor:'none'}}>
              Write another ↺
            </motion.button>
            {showCont && (
              <motion.button initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
                whileHover={{scale:1.05,boxShadow:'0 0 42px rgba(200,96,122,.22)'}} whileTap={{scale:.96}} onClick={onContinue}
                style={{background:'transparent',border:'1px solid rgba(242,168,192,.42)',borderRadius:50,padding:'.82rem 2.3rem',fontFamily:"'Montserrat',sans-serif",fontWeight:400,fontSize:'.71rem',letterSpacing:'.28em',textTransform:'uppercase',color:'#f2a8c0',cursor:'none'}}>
                One more surprise ♡
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
