'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Prizes.module.css'

export default function Prizes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLHeadingElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current || !numberRef.current || !bgRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    })

    tl.to(numberRef.current, {
      scale: 1.5,
      opacity: 0.8,
      y: -50,
      ease: 'power2.out'
    }, 0)

    tl.to(bgRef.current, {
      scale: 1.1,
      filter: 'brightness(0.6) contrast(1.2)',
      ease: 'none'
    }, 0)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section className={styles.prizesSection} ref={containerRef}>
      <div 
        ref={bgRef}
        className={styles.prizesBg}
        style={{ backgroundImage: 'url(/images/hero.jpg)' }}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={`${styles.subtitle} font-technical text-orange`}>EXPEDITION BOUNTY</div>
        <h2 ref={numberRef} className={`${styles.number} font-display`}>₹35K+</h2>
        <div className={`${styles.label} font-display`}>SUMMIT REWARD</div>
        
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <div className="font-technical text-orange mb-2">01</div>
            <h4 className="font-display">WINNER</h4>
            <p className="font-body">₹20,000 + Swag</p>
          </div>
          <div className={styles.detailCard}>
            <div className="font-technical text-orange mb-2">02</div>
            <h4 className="font-display">RUNNER UP</h4>
            <p className="font-body">₹10,000 + Swag</p>
          </div>
          <div className={styles.detailCard}>
            <div className="font-technical text-orange mb-2">03</div>
            <h4 className="font-display">TRACK WINNERS</h4>
            <p className="font-body">₹5,000 + Swag</p>
          </div>
        </div>
      </div>
    </section>
  )
}
