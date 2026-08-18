/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Sponsors.module.css'

const sponsors = [
  { id: '1', name: 'DEEPMIND', role: 'AI INFRASTRUCTURE', gridClass: 'posDeepmind' },
  { id: '2', name: 'POLYGON', role: 'L2 INFRASTRUCTURE', gridClass: 'posPolygon' },
  { id: '3', name: 'VERCEL', role: 'DEPLOYMENT PIPELINE', gridClass: 'posVercel' },
  { id: '4', name: 'SUPABASE', role: 'DATABASE CLUSTER', gridClass: 'posSupabase' },
  { id: '5', name: 'FIGMA', role: 'DESIGN SYSTEMS', gridClass: 'posFigma' },
  { id: '6', name: 'GITHUB', role: 'VERSION CONTROL', gridClass: 'posGithub' }
]

export default function Sponsors() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const sponsorRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current || !contentRef.current || !bgRef.current) return

    const ctx = gsap.context(() => {
      // Entrance Animation Sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      })

      // Fade in grid and heading
      tl.fromTo(contentRef.current!.querySelector(`.${styles.technicalGrid}`), 
        { opacity: 0 }, { opacity: 0.5, duration: 1, ease: 'power2.out' }
      )
      .fromTo(contentRef.current!.querySelector(`.${styles.header}`),
        { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.5'
      )
      
      // Stagger sponsor appearance
      tl.fromTo(sponsorRefs.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' },
        '-=0.5'
      )

      // Scroll Parallax (Background vs Foreground)
      gsap.to(bgRef.current, {
        yPercent: 15, // Moves background slightly as we scroll down
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })

      // Mouse Parallax Effect (Magnetic feel)
      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth <= 768) return // Disable on mobile

        const { clientX, clientY } = e
        const xPos = (clientX / window.innerWidth - 0.5) * 2
        const yPos = (clientY / window.innerHeight - 0.5) * 2

        // Move the content layer subtly
        gsap.to(contentRef.current, {
          x: xPos * -15, // Moves opposite to mouse
          y: yPos * -10,
          duration: 1,
          ease: 'power2.out'
        })

        // Move the background slightly in the same direction as mouse for depth
        gsap.to(bgRef.current, {
          x: xPos * 5,
          y: yPos * 5,
          duration: 2,
          ease: 'power2.out'
        })
      }

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="sponsors" ref={containerRef} className={styles.sponsorsSection}>
      
      {/* Deep environmental background */}
      <div className={styles.backgroundLayer}>
        <img 
          ref={bgRef}
          src="/images/challenges-bg-4k.jpg" 
          alt="Himalayan Environment" 
          className={styles.bgImage}
        />
        <div className={styles.bgGradient}></div>
      </div>
      
      {/* Topographic/coordinate grid overlay */}
      <div className={styles.technicalGrid}></div>

      <div ref={contentRef} className={styles.contentLayer}>
        
        {/* Editorial Heading */}
        <div className={styles.header}>
          <div className={styles.technicalLabel}>
            <span className="font-technical">PARTNERS / 06</span>
            <div className={styles.technicalLine}></div>
          </div>
          <h2 className="font-display">
            THE SYSTEMS<br/>
            BEHIND THE<br/>
            EXPEDITION.
          </h2>
        </div>

        {/* Asymmetric Sponsor Layout */}
        <div className={styles.sponsorGrid}>
          {sponsors.map((sponsor, index) => (
            <div 
              key={sponsor.id}
              ref={el => { sponsorRefs.current[index] = el }}
              className={`${styles.sponsorItem} ${styles[sponsor.gridClass]}`}
            >
              <div className={styles.sponsorContent}>
                <div className={styles.hoverLine}></div>
                <div className={`${styles.sponsorName} font-display`}>
                  {sponsor.name}
                </div>
                <div className={`${styles.sponsorMeta} font-technical`}>
                  <div className={styles.orangeMarker}></div>
                  <span>{sponsor.id.padStart(2, '0')} / {sponsor.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing metadata */}
        <div className={`${styles.bottomMeta} font-technical`}>
          <span>HIMALAYAN EXPEDITION</span>
          <span>MANALI / INDIA</span>
          <span>SYSTEM STATUS: ACTIVE</span>
        </div>

      </div>
    </section>
  )
}
