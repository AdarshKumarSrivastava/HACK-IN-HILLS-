/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import styles from './Navigation.module.css'
import { useTransition } from '@/context/TransitionContext'

const NAV_LINKS = [
  { label: 'EXPEDITION', id: 'hero' },
  { label: 'TRACKS', id: 'tracks' },
  { label: 'SCHEDULE', id: 'timeline' },
  { label: 'PEOPLE', id: 'people' },
  { label: 'SPONSORS', id: 'sponsors' }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const menuRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const navContainerRef = useRef<HTMLElement>(null)
  const registerBtnRef = useRef<HTMLButtonElement>(null)
  
  const { phase, startRegistrationTransition, transitionState } = useTransition()
  const pathname = usePathname()
  const router = useRouter()

  // App initialization & reveal
  useEffect(() => {
    if (!navContainerRef.current) return
    
    const ctx = gsap.context(() => {
      if (phase === 'preloading' || phase === 'transitioning') {
         gsap.set(navContainerRef.current, { opacity: 0, y: -15, filter: 'blur(10px)', pointerEvents: 'none' })
      } else if (phase === 'complete') {
         gsap.to(navContainerRef.current, {
           opacity: 1,
           y: 0,
           filter: 'blur(0px)',
           duration: 1.2,
           ease: 'power2.out',
           pointerEvents: 'auto'
         })
      }
    }, navContainerRef)
    
    return () => ctx.revert()
  }, [phase])

  // Scroll detection for Navbar transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section detection via robust scroll boundary check (matching SideRail)
  useEffect(() => {
    let ticking = false

    const updateActiveSection = () => {
      // Create a conceptual activation line around 40% of viewport height
      const activationLine = window.innerHeight * 0.4
      let closestSection = NAV_LINKS[0].id
      let minDistance = Infinity

      NAV_LINKS.forEach(link => {
        const el = document.getElementById(link.id)
        if (!el) return
        
        const rect = el.getBoundingClientRect()
        
        // If the activation line is currently within the section's bounds, it's active.
        if (rect.top <= activationLine && rect.bottom >= activationLine) {
           closestSection = link.id
           minDistance = 0 // Found an exact hit
        } else {
           // Fallback for edge cases: which section center is closest to activation line
           const sectionCenter = rect.top + rect.height / 2
           const distance = Math.abs(sectionCenter - activationLine)
           if (minDistance > 0 && distance < minDistance) {
             minDistance = distance
             closestSection = link.id
           }
        }
      })
      
      setActiveSection(prev => prev !== closestSection ? closestSection : prev)
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

  // Mobile menu GSAP animation
  useEffect(() => {
    if (!menuRef.current || !linksRef.current) return

    if (isOpen) {
      gsap.to(menuRef.current, {
        clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)',
        duration: 1,
        ease: 'power3.inOut'
      })
      gsap.fromTo(linksRef.current.children, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power2.out', delay: 0.3 }
      )
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)',
        duration: 0.8,
        ease: 'power3.inOut'
      })
    }
  }, [isOpen])

  // Magnetic Interaction for Desktop Links
  const handleMagneticMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const item = e.currentTarget
    const rect = item.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(item.querySelector('.navText'), {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMagneticLeave = (e: React.MouseEvent<HTMLLIElement>) => {
    const item = e.currentTarget
    gsap.to(item.querySelector('.navText'), {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    })
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsOpen(false)
    window.history.pushState(null, '', '#' + id)
    
    const element = document.getElementById(id)
    if (element) {
      if ((window as any).lenis) {
        // Explicitly compensate for fixed navbar, except for hero which starts at 0
        const offsetAmount = id === 'hero' ? 0 : -56
        ;(window as any).lenis.scrollTo(element, { offset: offsetAmount })
      } else {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    setIsOpen(false)
    
    // Phase 01: Click Response
    const btn = e.currentTarget as HTMLElement
    gsap.to(btn, {
      scale: 0.95,
      opacity: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })

    // Start full cinematic transition
    startRegistrationTransition('/register')
  }

  // Absolute requirement: Hide Navbar on Registration Page or while actively exiting from it
  if (pathname === '/register' || transitionState === 'exiting_register') {
    return null
  }

  return (
    <>
      {/* Desktop & Mobile Fixed Navbar */}
      <nav ref={navContainerRef} className={`${styles.navBar} ${isScrolled ? styles.scrolled : ''} font-technical`}>
        
        {/* LEFT: Spacer */}
        <div className={styles.navLeft}>
          {/* Branding removed per design clean-up */}
        </div>

        {/* CENTER: Desktop Links */}
        <div className={styles.navCenter}>
          <ul className={styles.desktopLinks}>
            {NAV_LINKS.map((link) => (
              <li 
                key={link.id}
                className={`${styles.navItem} ${activeSection === link.id ? styles.active : ''}`}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                <a 
                  href={`#${link.id}`} 
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={styles.navLink}
                >
                  <span className={`navText ${styles.navText}`}>{link.label}</span>
                  <span className={styles.activeIndicator}></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Actions */}
        <div className={styles.navRight}>
          {/* Desktop Register Button */}
          <button 
            ref={registerBtnRef}
            className={`${styles.registerBtn} font-technical`}
            onClick={handleRegisterClick}
          >
            <span className={styles.registerText}>REGISTER</span>
            <span className={styles.registerArrow}>↗</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className={`${styles.menuToggle} font-technical`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <div ref={menuRef} className={styles.mobileMenu}>
        <div className={styles.mobileMenuBackground}>
          <div className={styles.mobileMenuMountain} style={{ backgroundImage: 'url(/images/hero.jpg)' }}></div>
          <div className={styles.mobileMenuFog}></div>
        </div>
        
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileMenuHeader}>
            <span className="font-technical">NAVIGATION</span>
          </div>
          
          <ul ref={linksRef} className={styles.mobileLinksList}>
            {NAV_LINKS.map((link, index) => (
              <li key={link.id} className={styles.mobileLinkItem}>
                <a 
                  href={`#${link.id}`} 
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`${styles.mobileLink} font-display`}
                >
                  <span className={styles.mobileLinkNum}>0{index + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
            <li className={styles.mobileLinkItem} style={{ marginTop: '2rem' }}>
              <button 
                className={`${styles.mobileRegisterBtn} font-display text-orange`}
                onClick={handleRegisterClick}
              >
                REGISTER NOW ↗
              </button>
            </li>
          </ul>
          
          <div className={`${styles.mobileMenuFooter} font-technical`}>
            MANALI / INDIA<br/>
            WINTER EXPEDITION
          </div>
        </div>
      </div>
    </>
  )
}
