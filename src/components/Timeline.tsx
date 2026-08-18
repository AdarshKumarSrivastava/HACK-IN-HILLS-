/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Timeline.module.css'

const checkpoints = [
  { id: '01', title: 'BASE CAMP', desc: 'Registration & Briefing', elevation: '2,050M' },
  { id: '02', title: 'CAMP 01', desc: 'Opening Ceremony', elevation: '2,800M' },
  { id: '03', title: 'CAMP 02', desc: 'Hacking Begins', elevation: '3,400M' },
  { id: '04', title: 'CAMP 03', desc: 'Mentor Checkpoint', elevation: '4,200M' },
  { id: '05', title: 'SUMMIT', desc: 'Final Pitch', elevation: '5,100M' },
  { id: '06', title: 'DESCENT', desc: 'Awards & Closing', elevation: '2,050M' },
]

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const checkpointRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current || !pathRef.current) return

    const ctx = gsap.context(() => {
      // Calculate SVG path length for drawing animation
      const pathLength = pathRef.current!.getTotalLength()
      gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1
        }
      })

      // Draw the route
      tl.to(pathRef.current, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)

      // Subtle background parallax for the grid
      const technicalGrid = containerRef.current!.querySelector(`.${styles.technicalGrid}`)
      if (technicalGrid) {
        tl.to(technicalGrid, {
          y: '5vh', // Move grid slightly as user scrolls down
          ease: 'none',
          duration: 1
        }, 0)
      }

      // Animate checkpoints as the line reaches them
      checkpointRefs.current.forEach((ref, index) => {
        if (!ref) return
        const progressPoint = index / (checkpoints.length - 1)
        
        tl.to(ref, {
          opacity: 1,
          scale: 1,
          filter: 'grayscale(0)',
          ease: 'power2.out',
          duration: 0.1
        }, progressPoint)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="timeline" ref={containerRef} className={styles.timelineSection}>
      {/* Premium Architectural Background */}
      <div className={styles.backgroundLayer}>
        <div className={styles.baseDarkness}></div>
        <div className={styles.ambientLight}></div>
        <div className={styles.technicalGrid}></div>
        <div className={styles.gridCrosses}></div>
      </div>

      <div className={styles.header}>
        <h2 className="font-display">THE<br/>EXPEDITION<br/>BEGINS.</h2>
      </div>

      <div className={styles.routeContainer}>
        {/* SVG Mountain Route */}
        <svg className={styles.routeSvg} viewBox="0 0 1000 1500" preserveAspectRatio="none">
          <path 
            ref={pathRef}
            d="M 100,100 L 300,300 L 200,600 L 500,800 L 400,1100 L 800,1400" 
            fill="none" 
            stroke="var(--color-expedition-orange)" 
            strokeWidth="3" 
            strokeDasharray="10 10"
          />
        </svg>

        {/* Checkpoints mapped to SVG path points manually for layout */}
        <div className={styles.checkpointsWrapper}>
          {checkpoints.map((cp, i) => (
            <div 
              key={cp.id}
              ref={el => { checkpointRefs.current[i] = el }}
              className={`${styles.checkpoint} interactive`}
              style={{
                top: `${(i / (checkpoints.length - 1)) * 90 + 5}%`,
                left: i % 2 === 0 ? '10%' : '60%'
              }}
            >
              <div className={styles.node}></div>
              <div className={styles.content}>
                <div className={`${styles.elevation} font-technical text-orange`}>{cp.elevation}</div>
                <h3 className="font-display">{cp.title}</h3>
                <p className="font-technical">{cp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
