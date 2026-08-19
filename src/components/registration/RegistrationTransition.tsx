'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import styles from './RegistrationTransition.module.css'
import { useTransition } from '@/context/TransitionContext'

export default function RegistrationTransition() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ascentLineRef = useRef<HTMLDivElement>(null)
  const horizontalBridgeRef = useRef<HTMLDivElement>(null)
  const coordsRef = useRef<HTMLDivElement[]>([])
  const scanlineRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { transitionState, transitionTargetUrl, completeCinematicTransition, setPhase } = useTransition()

  // Track prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  const isRunningRef = useRef(false)

  useEffect(() => {
    if (transitionState === 'idle' || !transitionTargetUrl || !containerRef.current) {
      isRunningRef.current = false
      return
    }

    if (isRunningRef.current) return // Prevent double execution
    isRunningRef.current = true

    // Lock scroll for both entry and exit
    document.body.style.overflow = 'hidden'

    let navigationStarted = false

    // We use gsap.context to ensure perfect cleanup and deterministic state on every run
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          completeCinematicTransition()
        }
      })

      if (prefersReducedMotion) {
        // Fast elegant transition for reduced motion
        tl.to(containerRef.current, { opacity: 1, duration: 0.3 })
          .call(() => {
             if (navigationStarted) return
             navigationStarted = true
             router.push(transitionTargetUrl)
          })
          .to(containerRef.current, { opacity: 0, duration: 0.3, delay: 0.2 })
        return
      }

      if (transitionState === 'entering_register') {
        // ==========================================
        // ENTRY PROTOCOL
        // ==========================================
        
        // Initial clean state for entry
        gsap.set(containerRef.current, { pointerEvents: 'auto', opacity: 1 })
        gsap.set(bgRef.current, { opacity: 0, clipPath: 'inset(50% 50% 50% 50%)' })
        gsap.set(noiseRef.current, { opacity: 0 })
        gsap.set(gridRef.current, { opacity: 0 })
        gsap.set(coordsRef.current, { opacity: 0 })
        gsap.set(charsRef.current, { y: '100%', opacity: 0 })
        gsap.set(subtitleRef.current, { opacity: 0, innerText: 'ENTRY PROTOCOL' })
        gsap.set(scanlineRef.current, { y: '-10px', opacity: 0 })
        gsap.set(ascentLineRef.current, { height: '0%', bottom: 0, top: 'auto' })
        gsap.set(horizontalBridgeRef.current, { width: '0%', height: '1px' })

        tl.to(bgRef.current, {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.6,
          ease: 'power3.inOut'
        })
        
        tl.to(noiseRef.current, { opacity: 0.05, duration: 0.5 }, "-=0.4")
        tl.to(gridRef.current, { opacity: 0.8, duration: 0.5 }, "-=0.4")
        tl.to(coordsRef.current, { opacity: 0.6, duration: 0.4 }, "-=0.4")
        
        tl.to(charsRef.current, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power4.out'
        }, "-=0.2")

        tl.to(subtitleRef.current, { opacity: 1, duration: 0.5 }, "-=0.6")

        tl.to(scanlineRef.current, {
          y: '100vh',
          opacity: 0.5,
          duration: 1.5,
          ease: 'linear'
        }, "-=1.0")

        tl.to(ascentLineRef.current, {
          height: '100%',
          duration: 1.2,
          ease: 'power2.inOut'
        }, "-=0.8")

        tl.to(horizontalBridgeRef.current, {
          width: '100vw',
          duration: 0.6,
          ease: 'power3.inOut'
        }, "-=0.2")

        tl.call(() => {
          if (navigationStarted) return
          navigationStarted = true
          router.push(transitionTargetUrl)
        })

        tl.to(horizontalBridgeRef.current, { height: '100vh', duration: 0.4, ease: 'power2.inOut' }, "+=0.1")
          .to(containerRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })

      } else if (transitionState === 'exiting_register') {
        // ==========================================
        // EXIT PROTOCOL
        // ==========================================
        
        // Initial clean state for exit
        gsap.set(containerRef.current, { pointerEvents: 'auto', opacity: 1 })
        gsap.set(bgRef.current, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }) // Start fully covered
        gsap.set(noiseRef.current, { opacity: 0.05 })
        gsap.set(gridRef.current, { opacity: 0.8 })
        gsap.set(coordsRef.current, { opacity: 0.6 })
        gsap.set(charsRef.current, { y: '100%', opacity: 0 })
        gsap.set(subtitleRef.current, { opacity: 0, innerText: 'EXIT PROTOCOL' })
        gsap.set(scanlineRef.current, { y: '-10px', opacity: 0 })
        gsap.set(ascentLineRef.current, { height: '0%', top: 0, bottom: 'auto' }) // Descend from top
        gsap.set(horizontalBridgeRef.current, { width: '0%', height: '1px' })

        // Phase A: Registration UI Collapse (handled externally by pulling the section, but we coordinate timing)
        // We assume RegistrationModal handles its own exit if we want, or we just cover it quickly.
        // Let's cover it elegantly:
        
        // Phase B: Typography Entry
        tl.to(charsRef.current, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power4.out'
        }, 0.2)

        tl.to(subtitleRef.current, { opacity: 1, duration: 0.5 }, "-=0.6")

        // Phase C: Reverse Ascent / Descent Effect
        tl.to(ascentLineRef.current, {
          height: '100%',
          duration: 1.0,
          ease: 'power2.inOut'
        }, "-=0.4")

        tl.to(horizontalBridgeRef.current, {
          width: '100vw',
          duration: 0.6,
          ease: 'power3.inOut'
        }, "-=0.2")

        // Phase D: Route push
        tl.call(() => {
          // Tell context we are heading back so navbar knows to hide until complete
          setPhase('transitioning')
          if (navigationStarted) return
          navigationStarted = true
          router.push(transitionTargetUrl)
        })

        // Expand horizontal bridge to cover completely before revealing landing page
        tl.to(horizontalBridgeRef.current, { height: '100vh', duration: 0.4, ease: 'power2.inOut' }, "+=0.1")
        
        // Phase E: Reveal landing page
        tl.call(() => {
          // trigger the landing page entrance animations
          setPhase('complete')
        })

        // Fade the overlay itself to reveal the settling landing page
        tl.to(containerRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, "+=0.2")
      }

    }, containerRef)

    // Cleanup function that kills the timeline AND reverts all GSAP inline styles
    return () => {
      isRunningRef.current = false
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [transitionState, transitionTargetUrl, router, prefersReducedMotion, completeCinematicTransition, setPhase])

  const titleText = "EXPEDITION"

  return (
    <div 
      ref={containerRef} 
      className={`${styles.transitionContainer} ${transitionState !== 'idle' ? styles.active : ''}`}
      style={{ opacity: 0, pointerEvents: 'none' }} // Base styles, overridden by GSAP
    >
      <div ref={bgRef} className={styles.background}></div>
      <div ref={gridRef} className={styles.grid}></div>
      <div ref={noiseRef} className={styles.noise}></div>
      <div ref={scanlineRef} className={styles.scanline}></div>
      
      <div className={styles.coordTopLeft} ref={el => {if(el) coordsRef.current[0] = el}}>
        <div className={styles.coordinate}>SYS.INIT.01</div>
        <div className={styles.coordinate}>LAT 32.2396 N</div>
      </div>
      
      <div className={styles.coordBottomRight} ref={el => {if(el) coordsRef.current[1] = el}}>
        <div className={styles.coordinate}>ALT 2050M</div>
        <div className={styles.coordinate}>SYNC OK</div>
      </div>

      <div className={styles.typographyContainer}>
        <div className={styles.subtitle} ref={subtitleRef}>ENTRY PROTOCOL</div>
        <h1 className={`${styles.title} font-display`}>
          <span className={styles.titleLine}>
            {titleText.split('').map((char, i) => (
              <span key={i} className={styles.char} ref={el => {if(el) charsRef.current[i] = el}}>
                {char}
              </span>
            ))}
          </span>
        </h1>
      </div>

      <div className={styles.ascentLineContainer}>
        <div ref={ascentLineRef} className={styles.ascentLine}></div>
      </div>

      <div ref={horizontalBridgeRef} className={styles.horizontalBridge}></div>
    </div>
  )
}
