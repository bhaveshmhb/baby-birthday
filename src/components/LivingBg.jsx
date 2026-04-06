import React, { useEffect, useRef } from 'react'

export default function LivingBg() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight }
    resize(); window.addEventListener('resize', resize)

    const stars = Array.from({length:120},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      r:0.3+Math.random()*1.1, ph:Math.random()*Math.PI*2,
      spd:0.006+Math.random()*0.014,
      pink:Math.random()>0.82
    }))
    const petals = Array.from({length:16},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vx:(Math.random()-.5)*.28, vy:.18+Math.random()*.35,
      sz:4+Math.random()*7, rot:Math.random()*Math.PI*2,
      rs:(Math.random()-.5)*.013, op:.07+Math.random()*.11
    }))
    const flies = Array.from({length:7},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.45,
      ph:Math.random()*Math.PI*2, sz:1.8+Math.random()*1.8
    }))
    const hearts = Array.from({length:9},()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      vy:-.12-Math.random()*.22, ph:Math.random()*Math.PI*2,
      sz:5+Math.random()*7, op:.05+Math.random()*.08
    }))

    let t=0, raf
    const draw = () => {
      t+=.011; ctx.clearRect(0,0,cv.width,cv.height)
      // stars
      stars.forEach(s=>{
        const a=.12+.55*(0.5+0.5*Math.sin(t*s.spd*60+s.ph))
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2)
        ctx.fillStyle=s.pink?`rgba(242,168,192,${a})`:`rgba(255,255,255,${a*.7})`
        ctx.fill()
      })
      // petals
      petals.forEach(p=>{
        p.x+=p.vx+Math.sin(t+p.y*.008)*.22; p.y+=p.vy; p.rot+=p.rs
        if(p.y>cv.height+20){p.y=-20;p.x=Math.random()*cv.width}
        if(p.x<-20)p.x=cv.width+20; if(p.x>cv.width+20)p.x=-20
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot)
        ctx.beginPath(); ctx.ellipse(0,0,p.sz*.5,p.sz,0,0,Math.PI*2)
        ctx.fillStyle=`rgba(242,168,192,${p.op})`; ctx.fill(); ctx.restore()
      })
      // fireflies
      flies.forEach(f=>{
        f.x+=f.vx+Math.sin(t*.7+f.ph)*.35; f.y+=f.vy+Math.cos(t*.5+f.ph)*.28
        f.vx*=.996; f.vy*=.996
        if(f.x<0)f.x=cv.width; if(f.x>cv.width)f.x=0
        if(f.y<0)f.y=cv.height; if(f.y>cv.height)f.y=0
        if(Math.random()<.008){f.vx+=(Math.random()-.5)*.35;f.vy+=(Math.random()-.5)*.35}
        const glow=.08+.5*(0.5+0.5*Math.sin(t*2+f.ph))
        const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.sz*7)
        g.addColorStop(0,`rgba(255,230,200,${glow*.9})`); g.addColorStop(.35,`rgba(242,168,192,${glow*.3})`); g.addColorStop(1,'transparent')
        ctx.beginPath(); ctx.arc(f.x,f.y,f.sz*7,0,Math.PI*2); ctx.fillStyle=g; ctx.fill()
        ctx.beginPath(); ctx.arc(f.x,f.y,f.sz*.6,0,Math.PI*2); ctx.fillStyle=`rgba(255,240,210,${glow})`; ctx.fill()
      })
      // mini hearts
      hearts.forEach(h=>{
        h.y+=h.vy; h.ph+=.016; h.x+=Math.sin(h.ph)*.28
        if(h.y<-30){h.y=cv.height+20;h.x=Math.random()*cv.width}
        ctx.save(); ctx.translate(h.x,h.y); const s=h.sz/11
        ctx.scale(s,s); ctx.fillStyle=`rgba(200,96,122,${h.op})`
        ctx.beginPath()
        ctx.moveTo(0,3); ctx.bezierCurveTo(0,-1,-6,-1,-6,3); ctx.bezierCurveTo(-6,7,0,11,0,13)
        ctx.bezierCurveTo(0,11,6,7,6,3); ctx.bezierCurveTo(6,-1,0,-1,0,3)
        ctx.fill(); ctx.restore()
      })
      raf=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[])

  return <canvas ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,width:'100%',height:'100%'}}/>
}
