'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'
import dynamic from 'next/dynamic'
import { useTransition } from '@/context/TransitionContext'

// Dynamically import Canvas components to avoid SSR issues
const SnowSystem = dynamic(() => import('./canvas/SnowSystem'), { ssr: false })
const FogSystem = dynamic(() => import('./canvas/FogSystem'), { ssr: false })

export default function Hero() {
  const router = useRouter()
  const { phase, setPhase } = useTransition()
  
  const handleRegisterClick = () => {
    router.push('/register')
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const mountainBackRef = useRef<HTMLImageElement>(null)
  const mountainMidRef = useRef<HTMLImageElement>(null)
  const typographyRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  // Word refs for hover effects
  const hackRef = useRef<HTMLSpanElement>(null)
  const inRef = useRef<HTMLSpanElement>(null)
  const hillsRef = useRef<HTMLSpanElement>(null)

  const ctxRef = useRef<gsap.Context | null>(null)
  
  // Use a ref to access current phase inside event listeners without triggering re-renders
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  // MAIN ANIMATION & SCROLLTRIGGER CONTEXT (Runs Once)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context((self) => {
      // 1. Set initial deterministic state ONLY ONCE
      if (phaseRef.current === 'complete') {
        // If we are already complete (e.g. hot reload or returning to the page), 
        // skip hiding the text and just initialize ScrollTrigger.
        gsap.set(mountainBackRef.current, { scale: 1, y: 0, x: 0 })
        gsap.set(mountainMidRef.current, { scale: 1, y: 0, x: 0 })
        gsap.set([hackRef.current, inRef.current, hillsRef.current, dataRef.current, ctaRef.current], { 
          opacity: 1, y: 0, scale: 1, filter: 'none', visibility: 'visible' 
        })
        initScrollTrigger()
      } else {
        // Setup initial hidden state for preloading/transitioning
        gsap.set(mountainBackRef.current, { scale: 1.08, y: 0, x: 0 })
        gsap.set(mountainMidRef.current, { scale: 1.05, y: 0, x: 0 })
        gsap.set(hackRef.current, { y: 100, opacity: 0, filter: 'blur(20px)', visibility: 'visible' })
        gsap.set(inRef.current, { y: -50, opacity: 0, filter: 'blur(10px)', visibility: 'visible' })
        gsap.set(hillsRef.current, { y: 200, opacity: 0, scale: 0.8, filter: 'blur(30px)', visibility: 'visible' })
        gsap.set(dataRef.current, { opacity: 0 })
        gsap.set(ctaRef.current, { opacity: 0, y: 20 })

        // 2. Define Transition Sequence (Paused)
        const transitionTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            // Explicitly clear filters for performance and clarity
            gsap.set([hackRef.current, inRef.current, hillsRef.current], { clearProps: 'filter' })
            
            setPhase('complete') // Trigger navigation and interactive state
            
            // Initialize ScrollTrigger safely ONLY AFTER transition completes and dimensions are stable
            initScrollTrigger()
          }
        })

        // Cinematic Camera Push
        transitionTl.to(mountainBackRef.current, { scale: 1, duration: 3.5, ease: 'power2.out' }, 0)
        transitionTl.to(mountainMidRef.current, { scale: 1, duration: 3.0, ease: 'power2.out' }, 0)

        // Typography Entry
        transitionTl.to(hackRef.current, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }, 0.5)
        transitionTl.to(inRef.current, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'back.out(1.5)' }, 0.8)
        transitionTl.to(hillsRef.current, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out' }, 1.0)
        
        // Extras
        transitionTl.to([dataRef.current, ctaRef.current], { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', stagger: 0.2 }, 2.0)

        // Expose play method to context
        self.add('playTransition', () => {
          transitionTl.play()
        })
      }

      // 3. ScrollTrigger Initialization
      function initScrollTrigger() {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        })

        scrollTl.to(mountainBackRef.current, { y: '20%', ease: 'none' }, 0)
        scrollTl.to(mountainMidRef.current, { y: '10%', ease: 'none' }, 0)
        scrollTl.to(typographyRef.current, { y: '-40%', scale: 0.9, opacity: 0.2, ease: 'none' }, 0)
      }

      // 4. Mouse Parallax (always checks phaseRef for interactive state)
      const onMouseMove = (e: MouseEvent) => {
        if (phaseRef.current !== 'complete') return

        const { clientX, clientY } = e
        const xPos = (clientX / window.innerWidth - 0.5) * 2
        const yPos = (clientY / window.innerHeight - 0.5) * 2

        gsap.to(mountainBackRef.current, { x: xPos * 6, y: yPos * 6, duration: 1, ease: 'power2.out' })
        gsap.to(mountainMidRef.current, { x: xPos * 12, y: yPos * 12, duration: 1, ease: 'power2.out' })
        gsap.to(typographyRef.current, { x: xPos * -15, y: yPos * -15, duration: 1.5, ease: 'power2.out' })
        gsap.to(dataRef.current, { x: xPos * 8, y: yPos * 8, duration: 1, ease: 'power2.out' })
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true })

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
      }
    }, containerRef)
    
    ctxRef.current = ctx

    return () => {
      ctx.revert() // Destroys all timelines and ScrollTriggers on unmount
    }
  }, [setPhase]) // Empty dependency array (except stable setPhase) prevents context destruction

  // 5. Trigger Transition safely
  useEffect(() => {
    if (phase === 'transitioning' && ctxRef.current) {
      // @ts-expect-error - GSAP context dynamically adds methods
      ctxRef.current.playTransition()
    }
  }, [phase])

  // Word Hover Effects
  const handleWordEnter = (target: React.RefObject<HTMLSpanElement | null>) => {
    if (phase !== 'complete' || !ctxRef.current || !target.current) return
    ctxRef.current.add(() => {
      gsap.to(target.current, {
        scale: 1.05,
        letterSpacing: '0.02em',
        color: 'var(--color-snow-white)',
        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  }

  const handleWordLeave = (target: React.RefObject<HTMLSpanElement | null>, isOrange = false) => {
    if (phase !== 'complete' || !ctxRef.current || !target.current) return
    ctxRef.current.add(() => {
      gsap.to(target.current, {
        scale: 1,
        letterSpacing: isOrange ? '0.2em' : '-0.02em',
        color: isOrange ? 'var(--color-expedition-orange)' : 'var(--color-snow-white)',
        textShadow: 'none',
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  }

  return (
    <section id="hero" ref={containerRef} className={styles.heroContainer}>
      {/* Background Layers */}
      <div className={styles.backgroundLayer}>
        <div ref={mountainBackRef} className={styles.mountainBack} style={{ backgroundImage: 'url(/images/hero.jpg)' }} />
        <div className={styles.fogBack}>
          <FogSystem />
        </div>
      </div>

      {/* Snow System (Canvas) */}
      <div className={styles.snowLayer}>
        <SnowSystem />
      </div>

      {/* Typography Layer */}
      <div ref={typographyRef} className={styles.typographyLayer}>
        <h1 className="font-display">
          <div style={{ overflow: 'hidden', display: 'inline-block' }}>
            <span 
              ref={hackRef} 
              className={`${styles.wordHack} interactive`}
              style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              onMouseEnter={() => handleWordEnter(hackRef)}
              onMouseLeave={() => handleWordLeave(hackRef)}
            >
              HACK
            </span>
          </div>
          <div style={{ overflow: 'hidden', display: 'inline-block' }}>
            <span 
              ref={inRef} 
              className={`${styles.wordIn} interactive`}
              style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              onMouseEnter={() => handleWordEnter(inRef)}
              onMouseLeave={() => handleWordLeave(inRef, true)}
            >
              IN
            </span>
          </div>
          <div style={{ overflow: 'visible', display: 'inline-block' }}>
            <span 
              ref={hillsRef} 
              className={`${styles.wordHills} interactive`}
              style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
              onMouseEnter={() => handleWordEnter(hillsRef)}
              onMouseLeave={() => handleWordLeave(hillsRef)}
            >
              HILLS
            </span>
          </div>
        </h1>
        <div className={`${styles.subtitle} font-technical`}>MANALI</div>
      </div>

      {/* Midground Mountain */}
      <div ref={mountainMidRef} className={styles.midgroundLayer}>
        <div className={styles.mountainMidGradient} />
      </div>

      {/* Technical Data Layer */}
      <div ref={dataRef} className={`${styles.dataLayer} font-technical`}>
        <div className={styles.dataRight}>
          ELEVATION<br/>
          <span className="text-orange">2,050 M</span>
        </div>
        <div className={styles.dataBottom}>
          WINTER EXPEDITION<br/>
          48 HOURS
        </div>
      </div>

      {/* Interaction Layer */}
      <div ref={ctaRef} className={styles.interactionLayer}>
        <button 
          className={`${styles.primaryCta} font-display interactive`}
          onClick={handleRegisterClick}
        >
          <span className={styles.ctaText}>REGISTER FOR HACK IN HILLS</span>
          <div className={styles.ctaLine}></div>
          <span className={styles.ctaArrow}>↗</span>
        </button>
        
        <a href="#tracks" className={`${styles.secondaryCta} font-technical interactive`}>
          EXPLORE TRACKS ↓
        </a>
      </div>
    </section>
  )
}

