'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './AscentPreloader.module.css'
import { useTransition } from '@/context/TransitionContext'

export default function AscentPreloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contoursRef = useRef<SVGSVGElement>(null)
  const routePathRef = useRef<SVGPathElement>(null)
  const summitMarkerRef = useRef<SVGCircleElement>(null)
  const scanLightRef = useRef<HTMLDivElement>(null)
  
  const lightCutRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const brandTitleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  const { setPhase } = useTransition()

  useEffect(() => {
    const isReturning = sessionStorage.getItem('hih_signal_seen') === 'true'
    sessionStorage.setItem('hih_signal_seen', 'true')
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeScale = prefersReducedMotion ? 10 : (isReturning ? 2.5 : 1)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('transitioning')
          // Fade out the preloader container smoothly after handing off
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
          })
        }
      })

      // --- INITIAL STATE ---
      const routeLength = routePathRef.current?.getTotalLength() || 1000
      gsap.set(routePathRef.current, { strokeDasharray: routeLength, strokeDashoffset: routeLength, opacity: 0 })
      
      const contourPaths = contoursRef.current?.querySelectorAll('path') || []
      contourPaths.forEach(path => {
        const len = (path as SVGPathElement).getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
      })

      gsap.set(summitMarkerRef.current, { scale: 0, opacity: 0, transformOrigin: 'center' })
      gsap.set(scanLightRef.current, { x: '-100%', opacity: 0 })
      gsap.set(lightCutRef.current, { scaleY: 0, opacity: 0 })
      gsap.set(brandTitleRef.current, { opacity: 0, filter: 'blur(20px)', y: 20 })
      gsap.set(subtitleRef.current, { opacity: 0, filter: 'blur(10px)', y: 10 })

      // ==========================================
      // PHASE 01 — PRELOADER (SVG DRAWING)
      // ==========================================
      tl.to(routePathRef.current, { opacity: 1, duration: 0.1 }, 0.5)
      tl.to(routePathRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut' 
      }, 0.5)

      tl.to(summitMarkerRef.current, {
        scale: 1,
        opacity: 0.8,
        duration: 0.6,
        ease: 'back.out(2)'
      }, 1.4)

      contourPaths.forEach((path, i) => {
        tl.to(path, {
          strokeDashoffset: 0,
          opacity: 0.1,
          duration: 1.0,
          ease: 'power2.inOut'
        }, 0.8 + (i * 0.05))
      })

      // Freeze briefly
      tl.to({}, { duration: 0.5 })

      // ==========================================
      // PHASE 02 — ATMOSPHERIC COLLAPSE
      // ==========================================
      // SVG shrinks and fades out (pulling inward)
      tl.to([contoursRef.current, routePathRef.current, summitMarkerRef.current], {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.in',
        transformOrigin: 'center center'
      }, "+=0")

      // ==========================================
      // PHASE 03 — LIGHT CUT
      // ==========================================
      // A thin vertical icy light slices through
      tl.to(lightCutRef.current, {
        scaleY: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power4.inOut'
      }, "+=0.2")

      // Expands horizontally briefly while revealing text
      tl.to(lightCutRef.current, {
        scaleX: 20,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power2.out'
      }, "+=0")

      tl.to(brandTitleRef.current, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.5")

      tl.to(subtitleRef.current, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.6")

      // Hold the text briefly
      tl.to({}, { duration: 0.6 })

      // Text disappears sharply
      tl.to([brandTitleRef.current, subtitleRef.current], {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(10px)',
        duration: 0.5,
        ease: 'power2.in'
      })

      tl.timeScale(timeScale)
    })

    return () => ctx.revert()
  }, [setPhase])

  return (
    <div ref={containerRef} className={styles.container}>
      {/* 1. Topographic Contours & Route (SVG) */}
      <svg ref={contoursRef} className={styles.topographySvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <path d="M 0,800 Q 200,750 400,850 T 800,700 T 1000,800" className={styles.contour} />
        <path d="M 0,700 Q 250,650 450,750 T 850,600 T 1000,700" className={styles.contour} />
        <path d="M 0,600 Q 300,550 500,650 T 900,500 T 1000,600" className={styles.contour} />
        <path d="M -100,500 Q 350,450 550,550 T 950,400 T 1100,500" className={styles.contour} />
        <path d="M 100,400 Q 400,350 600,450 T 1000,300" className={styles.contour} />
        
        <path d="M 300,300 C 400,200 600,200 700,300 C 600,400 400,400 300,300 Z" className={styles.contour} />
        <path d="M 350,280 C 450,180 550,180 650,280 C 550,380 450,380 350,280 Z" className={styles.contour} />
        <path d="M 420,250 C 480,180 520,180 580,250 C 520,320 480,320 420,250 Z" className={styles.contour} />
        <path d="M 480,220 C 495,200 505,200 520,220 C 505,240 495,240 480,220 Z" className={styles.contour} />

        <path 
          ref={routePathRef}
          d="M 200,900 L 350,750 L 450,600 L 420,450 L 500,220" 
          className={styles.route} 
        />
        <circle ref={summitMarkerRef} cx="500" cy="220" r="4" className={styles.summitMarker} />
      </svg>

      {/* 2. Light Cut */}
      <div ref={lightCutRef} className={styles.lightCut}></div>

      {/* 3. Brand Reveal */}
      <div ref={brandRef} className={styles.brandWrapper}>
        <div ref={brandTitleRef} className={`${styles.brandTitle} font-display`}>
          HACK IN HILLS<br />MANALI
        </div>
        <div ref={subtitleRef} className={`${styles.brandSubtitle} font-technical`}>
          THE EXPEDITION
        </div>
      </div>
    </div>
  )
}
