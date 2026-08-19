'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './FinalSummit.module.css'
import { useTransition } from '@/context/TransitionContext'

export default function FinalSummit() {
  const containerRef = useRef<HTMLDivElement>(null)
  const footerContentRef = useRef<HTMLDivElement>(null)
  const { startRegistrationTransition } = useTransition()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current || !footerContentRef.current) return

    // Subtle reveal animation for footer content
    const elements = footerContentRef.current.querySelectorAll(
      `.${styles.footerCol}, .${styles.finalLine}, .${styles.bottomBar}`
    )

    gsap.fromTo(elements,
      { y: 20, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%'
        }
      }
    )
  }, [])

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault()
    const btn = e.currentTarget as HTMLElement
    gsap.to(btn, {
      scale: 0.95,
      opacity: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })
    startRegistrationTransition('/register')
  }

  return (
    <footer id="summit" ref={containerRef} className={styles.summitSection}>
      
      <div ref={footerContentRef} className={styles.footerContent}>
        
        {/* Thin separator */}
        <div className={styles.separator}></div>

        {/* 3-column information grid */}
        <div className={styles.footerGrid}>
          <div className={`${styles.footerCol} font-technical`}>
            <p className={styles.colLabel}>COORDINATES</p>
            <p>32°14&apos;N / 77°11&apos;E</p>
            <p>ELEVATION: 2,050 M</p>
          </div>
          
          <div className={`${styles.footerCol} font-technical`}>
            <p className={styles.colLabel}>CONNECT</p>
            <a href="#" className={`${styles.socialLink} interactive`}>
              <span>TWITTER</span>
              <span className={styles.arrow}>↗</span>
            </a>
            <a href="#" className={`${styles.socialLink} interactive`}>
              <span>INSTAGRAM</span>
              <span className={styles.arrow}>↗</span>
            </a>
            <a href="#" className={`${styles.socialLink} interactive`}>
              <span>DISCORD</span>
              <span className={styles.arrow}>↗</span>
            </a>
          </div>
          
          <div className={`${styles.footerCol} font-technical`}>
            <p className={styles.colLabel}>CONTACT</p>
            <a href="mailto:hello@hackinhills.com" className={`${styles.emailLink} interactive`}>
              HELLO@HACKINHILLS.COM
            </a>
            <p>ORGANIZED WITH ♥ IN HIMACHAL</p>
          </div>
        </div>

        {/* Closing editorial statement */}
        <div className={styles.closingSection}>
          <div className={`${styles.finalLine} font-display`}>
            THE MOUNTAINS ARE WAITING.
          </div>
          
          <div className={styles.bottomBar}>
            <span className="font-technical">HACK IN HILLS / MANALI</span>
            <button onClick={handleRegister} className={`${styles.registerLink} font-technical interactive`} style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>
              REGISTER <span className={styles.arrow}>↗</span>
            </button>
            <span className="font-technical">© 2026</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
