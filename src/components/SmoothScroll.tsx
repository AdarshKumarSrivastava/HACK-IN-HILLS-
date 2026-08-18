/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'



export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.5,
      touchMultiplier: 1.5,
    })
    
    lenisRef.current = lenis
    ;(window as any).lenis = lenis

    // Sync GSAP ScrollTrigger with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)

    return () => {
      if (typeof (lenis as any)?.destroy === 'function') {
        (lenis as any).destroy()
      }
      (window as any).lenis = undefined
      gsap.ticker.remove((time) => {
        if (typeof lenis?.raf === 'function') {
          lenis.raf(time * 1000)
        }
      })
    }
  }, [])

  return <>{children}</>
}
