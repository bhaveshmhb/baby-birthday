import { useEffect } from 'react'
export default function SparkleTrail() {
  useEffect(() => {
    const COLORS=['#f2a8c0','#e8849a','#fce4ec','#ffd6e7','#fff','#f48fb1']
    let last=0
    const onMove=e=>{
      const now=Date.now(); if(now-last<38)return; last=now
      for(let i=0;i<3;i++){
        const d=document.createElement('div')
        const sz=2+Math.random()*5, angle=Math.random()*Math.PI*2, dist=18+Math.random()*32
        d.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:${COLORS[Math.floor(Math.random()*COLORS.length)]};border-radius:50%;pointer-events:none;z-index:99990;transform:translate(-50%,-50%)`
        document.body.appendChild(d)
        d.animate([{opacity:1,transform:`translate(-50%,-50%) scale(1)`},{opacity:0,transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`}],{duration:650,easing:'ease-out',fill:'forwards'})
        setTimeout(()=>d.remove(),680)
      }
    }
    window.addEventListener('mousemove',onMove)
    return ()=>window.removeEventListener('mousemove',onMove)
  },[])
  return null
}
