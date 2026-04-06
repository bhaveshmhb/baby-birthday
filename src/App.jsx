import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import HeartReveal     from './scenes/HeartReveal.jsx'
import LoadingGate     from './scenes/LoadingGate.jsx'
import GalaxyLanding   from './scenes/GalaxyLanding.jsx'
import OurStory        from './scenes/OurStory.jsx'
import CakeScene       from './scenes/CakeScene.jsx'
import PolaroidWall    from './scenes/PolaroidWall.jsx'
import HeartReasons    from './scenes/HeartReasons.jsx'
import AIPoem          from './scenes/AIPoem.jsx'
import VoiceVisualizer from './scenes/VoiceVisualizer.jsx'
import GrandFinale     from './scenes/GrandFinale.jsx'
import LivingBg        from './components/LivingBg.jsx'
import SparkleTrail    from './components/SparkleTrail.jsx'

// SCENE ORDER:
// heartreveal → loading → galaxy → story → CAKE 🎂 → polaroid → heartreasons → poem → voice → finale

export default function App() {
  const [scene, setScene] = useState('heartreveal')
  const go = (s) => setTimeout(() => setScene(s), 80)

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
      <LivingBg />
      <SparkleTrail />
      <AnimatePresence mode="wait">
        {scene === 'heartreveal'  && <HeartReveal     key="hr"  onDone={()=>go('loading')} />}
        {scene === 'loading'      && <LoadingGate     key="lg"  onUnlock={()=>go('galaxy')} />}
        {scene === 'galaxy'       && <GalaxyLanding   key="gl"  onContinue={()=>go('story')} />}
        {scene === 'story'        && <OurStory        key="st"  onContinue={()=>go('cake')} />}
        {scene === 'cake'         && <CakeScene       key="ck"  onContinue={()=>go('polaroid')} />}
        {scene === 'polaroid'     && <PolaroidWall    key="pw"  onContinue={()=>go('heartreasons')} />}
        {scene === 'heartreasons' && <HeartReasons    key="hrt" onContinue={()=>go('poem')} />}
        {scene === 'poem'         && <AIPoem          key="ap"  onContinue={()=>go('voice')} />}
        {scene === 'voice'        && <VoiceVisualizer key="vv"  onContinue={()=>go('finale')} />}
        {scene === 'finale'       && <GrandFinale     key="gf"  />}
      </AnimatePresence>
    </div>
  )
}
