'use client'

import Hero from '@/components/Hero'
import Timeline from '@/components/Timeline'
import Tracks from '@/components/Tracks'
import Prizes from '@/components/Prizes'
import Judges from '@/components/Judges'
import Sponsors from '@/components/Sponsors'
import FinalSummit from '@/components/FinalSummit'
import AscentPreloader from '@/components/preloader/AscentPreloader'
import { useTransition } from '@/context/TransitionContext'

export default function Home() {
  const { phase } = useTransition()

  return (
    <main>
      {phase === 'preloading' && <AscentPreloader />}
      <Hero />
      <Tracks />
      <Timeline />
      <Prizes />
      <Judges />
      <Sponsors />
      <FinalSummit />
    </main>
  )
}
