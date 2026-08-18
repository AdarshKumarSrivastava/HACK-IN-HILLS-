'use client'

import { useEffect, useRef } from 'react'

export default function SnowCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // 1. Detect Touch Devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    // 2. Motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    let mouseX = width / 2
    let mouseY = height / 2
    let cursorX = mouseX
    let cursorY = mouseY
    let prevCursorX = cursorX
    let prevCursorY = cursorY
    let velocityX = 0
    let velocityY = 0

    let isHovering = false
    let isClicking = false
    let isRegisterHover = false

    const particles: Particle[] = []
    const fogs: FogParticle[] = []

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      alpha: number

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x
        this.y = y
        // inherit slight momentum, add scatter
        this.vx = vx * 0.15 + (Math.random() - 0.5) * 1.5
        this.vy = vy * 0.15 + Math.random() * 0.5 + 0.1 // drift down slowly
        this.maxLife = 30 + Math.random() * 40
        this.life = this.maxLife
        this.size = Math.random() * 1.5 + 0.5
        this.alpha = Math.random() * 0.4 + 0.2
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.95 // air friction
        this.vy *= 0.98
        this.life--
      }
      draw(ctx: CanvasRenderingContext2D) {
        const currentAlpha = (this.life / this.maxLife) * this.alpha
        ctx.fillStyle = `rgba(220, 230, 255, ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class FogParticle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      maxSize: number
      alpha: number
      turbulence: number

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x
        this.y = y
        
        // Trail BEHIND the cursor movement
        this.vx = -vx * 0.08 + (Math.random() - 0.5) * 1.5
        this.vy = -vy * 0.08 - Math.random() * 0.5 // Initial slight upward drift
        
        // 600-1200ms lifetime (~36-72 frames at 60fps)
        this.maxLife = 35 + Math.random() * 40
        this.life = this.maxLife
        
        this.size = 5 // Start small
        
        // Size distribution: 60% small, 30% medium, 10% large
        const rand = Math.random()
        if (rand < 0.6) this.maxSize = 25 + Math.random() * 20
        else if (rand < 0.9) this.maxSize = 45 + Math.random() * 25
        else this.maxSize = 75 + Math.random() * 35

        // Slightly more visible atmospheric fog
        this.alpha = Math.random() * 0.08 + 0.04
        this.turbulence = Math.random() * 0.15
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        
        // Turbulence & drift
        this.vx += (Math.random() - 0.5) * this.turbulence
        this.vy += (Math.random() - 0.5) * this.turbulence - 0.02 // drift up
        
        // Damping / Air resistance
        this.vx *= 0.92
        this.vy *= 0.92

        this.size += (this.maxSize - this.size) * 0.06
        this.life--
      }
      draw(ctx: CanvasRenderingContext2D) {
        // Soft fade in and out based on life
        let currentAlpha = this.alpha
        const lifeRatio = this.life / this.maxLife
        if (lifeRatio > 0.8) {
          // Fade in
          currentAlpha = this.alpha * ((1 - lifeRatio) * 5)
        } else {
          // Fade out naturally
          currentAlpha = this.alpha * (lifeRatio / 0.8)
        }

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        gradient.addColorStop(0, `rgba(200, 220, 255, ${currentAlpha})`)
        gradient.addColorStop(1, 'rgba(200, 220, 255, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const emitSnow = (count: number) => {
      if (prefersReducedMotion) return
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(cursorX, cursorY, velocityX, velocityY))
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    const handleMouseDown = () => {
      isClicking = true
      emitSnow(6)
    }

    const handleMouseUp = () => {
      isClicking = false
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [role="button"]')
      
      if (isInteractive) {
        isHovering = true
        // Check if it's the register button (needs class match)
        if (target.className && typeof target.className === 'string' && target.className.includes('registerBtn')) {
          isRegisterHover = true
        } else {
          isRegisterHover = false
        }
      } else {
        isHovering = false
        isRegisterHover = false
      }

      // Check text inputs without forcing synchronous layout
      const isText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (isText) {
        document.body.removeAttribute('data-custom-cursor')
        canvas.style.opacity = '0'
      } else {
        document.body.setAttribute('data-custom-cursor', 'true')
        canvas.style.opacity = '1'
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver)

    // Initially activate custom cursor
    document.body.setAttribute('data-custom-cursor', 'true')

    let animationFrameId: number

    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      
      // Pause completely if tab is hidden
      if (document.visibilityState === 'hidden') return

      ctx.clearRect(0, 0, width, height)

      // Lerp cursor position
      const lerpFactor = prefersReducedMotion ? 1 : 0.15
      cursorX += (mouseX - cursorX) * lerpFactor
      cursorY += (mouseY - cursorY) * lerpFactor

      velocityX = cursorX - prevCursorX
      velocityY = cursorY - prevCursorY
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY)

      prevCursorX = cursorX
      prevCursorY = cursorY

      // Idle breathing
      const time = Date.now() * 0.002
      const idleBreathe = speed < 0.1 ? Math.sin(time) * 1.8 : 0

      // Emit particles
      if (speed > 1 && Math.random() > 0.6 && !prefersReducedMotion) {
        particles.push(new Particle(cursorX, cursorY, velocityX, velocityY))
      }
      
      // Emit fog proportionally to speed
      if (speed > 0.5 && !prefersReducedMotion) {
        const emitCount = Math.min(Math.ceil(speed * 0.2), 6) // Max 6 particles per frame on very fast movement
        for (let i = 0; i < emitCount; i++) {
          fogs.push(new FogParticle(cursorX, cursorY, velocityX, velocityY))
        }
      }

      // Cap fog array to prevent massive memory leaks on extreme rapid movement
      if (fogs.length > 250) {
        fogs.splice(0, fogs.length - 250)
      }

      // Draw fogs
      for (let i = fogs.length - 1; i >= 0; i--) {
        const fog = fogs[i]
        fog.update()
        fog.draw(ctx)
        if (fog.life <= 0) fogs.splice(i, 1)
      }

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.update()
        p.draw(ctx)
        if (p.life <= 0) particles.splice(i, 1)
      }

      // Draw core cursor (Sizes increased ~20%)
      ctx.beginPath()
      
      let coreSize = 3.6 + idleBreathe
      let haloSize = 14.5 + idleBreathe
      
      if (isHovering) {
        coreSize = 5.4
        haloSize = 19
      }
      if (isClicking) {
        coreSize = 2.4
        haloSize = 9.5
      }
      if (isRegisterHover) {
        coreSize = 6
        haloSize = 24
      }

      // Motion blur stretch (optional very subtle effect for fast movement)
      const stretchX = velocityX * 0.05
      const stretchY = velocityY * 0.05

      // Halo
      const haloGradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, haloSize)
      haloGradient.addColorStop(0, isRegisterHover ? 'rgba(225, 110, 54, 0.3)' : 'rgba(200, 220, 255, 0.25)')
      haloGradient.addColorStop(1, 'rgba(200, 220, 255, 0)')
      
      ctx.fillStyle = haloGradient
      ctx.arc(cursorX + stretchX, cursorY + stretchY, haloSize, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.arc(cursorX, cursorY, coreSize, 0, Math.PI * 2)
      ctx.fill()
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animationFrameId)
      document.body.removeAttribute('data-custom-cursor')
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        transition: 'opacity 0.2s ease',
      }}
    />
  )
}
