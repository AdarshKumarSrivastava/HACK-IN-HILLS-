/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import styles from './SideRail.module.css'
import { useTransition } from '@/context/TransitionContext'

const sections = [
  { id: 'hero', name: 'EXPEDITION' },
  { id: 'tracks', name: 'CHALLENGES' },
  { id: 'timeline', name: 'SCHEDULE' },
  { id: 'people', name: 'PEOPLE' },
  { id: 'sponsors', name: 'SPONSORS' }
]

export default function SideRail() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('hero')
  const [hideRail, setHideRail] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)
  
  const { phase } = useTransition()

  // App initialization & reveal
  useEffect(() => {
    if (!railRef.current) return
    
    const ctx = gsap.context(() => {
      if (phase === 'preloading' || phase === 'transitioning') {
         gsap.set(railRef.current, { opacity: 0, x: -15, filter: 'blur(10px)', pointerEvents: 'none' })
      } else if (phase === 'complete') {
         gsap.to(railRef.current, {
           opacity: hideRail ? 0 : 1,
           x: 0,
           filter: 'blur(0px)',
           duration: 1.2,
           ease: 'power2.out',
           pointerEvents: hideRail ? 'none' : 'auto'
         })
      }
    }, railRef)
    
    return () => ctx.revert()
  }, [phase, hideRail])

  useEffect(() => {
    let ticking = false

    const updateActiveSection = () => {
      // Create a conceptual activation line around 40% of viewport height
      const activationLine = window.innerHeight * 0.4
      let closestSection = sections[0].id
      let minDistance = Infinity

      sections.forEach(section => {
        const el = document.getElementById(section.id)
        if (!el) return
        
        const rect = el.getBoundingClientRect()
        
        // If the activation line is currently within the section's bounds, it's active.
        if (rect.top <= activationLine && rect.bottom >= activationLine) {
           closestSection = section.id
           minDistance = 0 // Found an exact hit
        } else {
           // Fallback for edge cases: which section center is closest to activation line
           const sectionCenter = rect.top + rect.height / 2
           const distance = Math.abs(sectionCenter - activationLine)
           if (minDistance > 0 && distance < minDistance) {
             minDistance = distance
             closestSection = section.id
           }
        }
      })
      
      setActiveSection(prev => prev !== closestSection ? closestSection : prev)

      // Hide rail when footer is in view
      const footer = document.getElementById('summit')
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        setHideRail(footerRect.top < window.innerHeight * 0.6)
      }

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection)
        ticking = true
      }
    }

    // Use passive scroll listener for high performance
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    
    // Initial calculation
    updateActiveSection()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (pathname === '/register') {
    return null
  }

  return (
    <div ref={railRef} className={`${styles.sideRail} font-technical`} style={{ opacity: hideRail ? 0 : 1, transition: 'opacity 0.4s ease', pointerEvents: hideRail ? 'none' : undefined }}>
      <ul className={styles.railList}>
        {sections.map((section, index) => {
          const numStr = (index + 1).toString().padStart(2, '0')
          const isActive = activeSection === section.id
          return (
            <li 
              key={section.id} 
              className={`${styles.railItem} ${isActive ? styles.active : ''} interactive`}
              onClick={() => {
                // Keep URL synchronized
                window.history.pushState(null, '', '#' + section.id)
                
                const el = document.getElementById(section.id)
                if (el) {
                  // Synchronize with existing Lenis instance if available
                  if ((window as any).lenis) {
                    const offsetAmount = section.id === 'hero' ? 0 : -56
                    ;(window as any).lenis.scrollTo(el, { offset: offsetAmount })
                  } else {
                    el.scrollIntoView({ behavior: 'smooth' })
                  }
                }
              }}
            >
              <div className={styles.markerContainer}>
                <div className={styles.marker}></div>
                <div className={styles.line}></div>
              </div>
              <div className={styles.textContainer}>
                <span className={styles.number}>{numStr}</span>
                <span className={styles.name}>{section.name}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
