'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isInteractive, setIsInteractive] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsHidden(true)
      return
    }

    const cursor = cursorRef.current
    if (!cursor) return

    // Setup mouse move listener
    const onMouseMove = (e: MouseEvent) => {
      if (isHidden) setIsHidden(false)
      
      // Use GSAP for smooth tracking
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      })
    }

    // Setup interaction listeners
    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
        
      if (isClickable) {
        setIsInteractive(true)
      }
    }

    const onMouseLeave = () => {
      setIsInteractive(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseEnter)
    document.addEventListener('mouseout', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseEnter)
      document.removeEventListener('mouseout', onMouseLeave)
    }
  }, [isHidden])

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${isInteractive ? 'interactive' : ''} ${isHidden ? 'hidden' : ''}`}
    />
  )
}
