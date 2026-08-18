'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import styles from './RegistrationModal.module.css'

type Step = 'IDENTITY' | 'TEAM' | 'EXPEDITION' | 'FINAL' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'

export default function RegistrationModal() {
  const [currentStep, setCurrentStep] = useState<Step>('IDENTITY')
  const searchParams = useSearchParams()
  const initialTrack = searchParams.get('track') || ''
  
  const [regId, setRegId] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', college: '', degree: '', year: '',
    teamName: '', teamSize: '1', leader: '', github: '', linkedin: '',
    track: initialTrack, skills: '', idea: '',
    accommodation: 'No', dietary: 'None', terms: false
  })

  // Mouse Parallax effect for the background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current || !bgRef.current) return
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      const rect = sectionRef.current.getBoundingClientRect()
      
      // Only parallax if the section is somewhat in view
      if (rect.top > window.innerHeight || rect.bottom < 0) return

      const x = (e.clientX / window.innerWidth - 0.5) * 30 // max 15px movement
      const y = (e.clientY / window.innerHeight - 0.5) * 30

      gsap.to(bgRef.current, {
        x,
        y,
        duration: 1.5,
        ease: 'power2.out'
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const nextStep = (next: Step) => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        autoAlpha: 0, x: -30, duration: 0.4, onComplete: () => {
          setCurrentStep(next)
          gsap.fromTo(contentRef.current, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' })
        }
      })
    }
  }

  const submitRegistration = async () => {
    nextStep('SUBMITTING')
    
    // Simulate Supabase API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 2500))
      // Mock Success
      const id = `HIH-${Math.floor(Math.random() * 1000000)}`
      setRegId(id)
      setCurrentStep('SUCCESS')
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 1 })
      }
    } catch {
      setCurrentStep('ERROR')
    }
  }

  return (
    <section id="registration" ref={sectionRef} className={styles.section}>
      <Link href="/" className={`${styles.backButton} font-technical interactive`}>
        ← BACK TO EXPEDITION
      </Link>

      <div ref={bgRef} className={styles.background}>
        <Image 
          src="/images/registration-bg-4k.jpg" 
          alt="Himalayan Expedition"
          fill
          unoptimized={true}
          priority
          className={styles.bgImage}
        />
        <div className={styles.overlayGradient}></div>
      </div>

      <div className={styles.container}>
        <div ref={contentRef} className={styles.content}>
          
          {currentStep === 'IDENTITY' && (
            <div className={styles.stepBlock}>
              <h2 className="font-display">ENTER THE<br/>EXPEDITION.</h2>
              <div className="font-technical text-cold-grey mb-8">STEP 01 — IDENTITY</div>
              
              <div className={styles.grid}>
                <input name="fullName" placeholder="FULL NAME" value={formData.fullName} onChange={handleChange} className={styles.input} />
                <input name="email" type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={handleChange} className={styles.input} />
                <input name="phone" placeholder="PHONE NUMBER" value={formData.phone} onChange={handleChange} className={styles.input} />
                <input name="college" placeholder="COLLEGE / UNIVERSITY" value={formData.college} onChange={handleChange} className={styles.input} />
                <input name="degree" placeholder="COURSE / DEGREE" value={formData.degree} onChange={handleChange} className={styles.input} />
                <select name="year" value={formData.year} onChange={handleChange} className={styles.input}>
                  <option value="">YEAR OF STUDY</option>
                  <option value="1">FIRST YEAR</option>
                  <option value="2">SECOND YEAR</option>
                  <option value="3">THIRD YEAR</option>
                  <option value="4">FOURTH YEAR</option>
                </select>
              </div>

              <div className={styles.actions}>
                <button onClick={() => nextStep('TEAM')} className={`${styles.btn} font-technical interactive`}>PROCEED TO TEAM ↗</button>
              </div>
            </div>
          )}

          {currentStep === 'TEAM' && (
            <div className={styles.stepBlock}>
              <h2 className="font-display">FORM YOUR<br/>SQUAD.</h2>
              <div className="font-technical text-cold-grey mb-8">STEP 02 — TEAM</div>
              
              <div className={styles.grid}>
                <input name="teamName" placeholder="TEAM NAME" value={formData.teamName} onChange={handleChange} className={styles.input} />
                <select name="teamSize" value={formData.teamSize} onChange={handleChange} className={styles.input}>
                  <option value="1">LONE WOLF (1)</option>
                  <option value="2">DUO (2)</option>
                  <option value="3">TRIO (3)</option>
                  <option value="4">SQUAD (4)</option>
                </select>
                <input name="leader" placeholder="TEAM LEADER NAME" value={formData.leader} onChange={handleChange} className={styles.input} />
                <input name="github" placeholder="GITHUB PROFILE URL" value={formData.github} onChange={handleChange} className={styles.input} />
                <input name="linkedin" placeholder="LINKEDIN / PORTFOLIO" value={formData.linkedin} onChange={handleChange} className={styles.input} style={{ gridColumn: '1 / -1' }}/>
              </div>

              <div className={styles.actions}>
                <button onClick={() => nextStep('EXPEDITION')} className={`${styles.btn} font-technical interactive`}>PROCEED TO EXPEDITION ↗</button>
              </div>
            </div>
          )}

          {currentStep === 'EXPEDITION' && (
            <div className={styles.stepBlock}>
              <h2 className="font-display">CHOOSE YOUR<br/>SUMMIT.</h2>
              <div className="font-technical text-cold-grey mb-8">STEP 03 — EXPEDITION</div>
              
              <div className={styles.formGroup}>
                <select name="track" value={formData.track} onChange={handleChange} className={styles.input}>
                  <option value="">SELECT PREFERRED TRACK</option>
                  <option value="AI / ML">INTELLIGENCE (AI / ML)</option>
                  <option value="WEB3 / BLOCKCHAIN">DECENTRALIZATION (WEB3)</option>
                  <option value="CYBERSECURITY">DEFENSE (CYBERSECURITY)</option>
                  <option value="GAME DEV / AR / VR">DIGITAL WORLDS (AR/VR)</option>
                  <option value="OPEN INNOVATION">FRONTIER (OPEN)</option>
                </select>
                
                <input name="skills" placeholder="PRIMARY SKILLS / TECHNOLOGIES" value={formData.skills} onChange={handleChange} className={styles.input} />
                <textarea name="idea" placeholder="BRIEF PROJECT IDEA (OPTIONAL)" value={formData.idea} onChange={handleChange} className={styles.textarea} />
              </div>

              <div className={styles.actions}>
                <button onClick={() => nextStep('FINAL')} className={`${styles.btn} font-technical interactive`}>FINAL DETAILS ↗</button>
              </div>
            </div>
          )}

          {currentStep === 'FINAL' && (
            <div className={styles.stepBlock}>
              <h2 className="font-display">LOGISTICS &<br/>CONFIRMATION.</h2>
              <div className="font-technical text-cold-grey mb-8">STEP 04 — FINAL</div>
              
              <div className={styles.formGroup}>
                <select name="accommodation" value={formData.accommodation} onChange={handleChange} className={styles.input}>
                  <option value="No">ACCOMMODATION REQUIRED? (NO)</option>
                  <option value="Yes">ACCOMMODATION REQUIRED? (YES)</option>
                </select>
                
                <input name="dietary" placeholder="DIETARY RESTRICTIONS (IF ANY)" value={formData.dietary} onChange={handleChange} className={styles.input} />
                
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
                  <span className="font-technical text-cold-grey text-sm">I ACCEPT THE EXPEDITION RULES AND CONDITIONS.</span>
                </label>
              </div>

              <div className={styles.actions}>
                <button 
                  onClick={submitRegistration} 
                  disabled={!formData.terms}
                  className={`${styles.submitBtn} font-technical interactive registerBtn`}
                >
                  TRANSMIT REGISTRATION ↗
                </button>
              </div>
            </div>
          )}

          {currentStep === 'SUBMITTING' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <div className="font-technical text-orange mt-8">TRANSMITTING EXPEDITION DATA...</div>
            </div>
          )}

          {currentStep === 'SUCCESS' && (
            <div className={styles.successState}>
              <h2 className="font-display text-snow-white">EXPEDITION<br/>CONFIRMED.</h2>
              <div className="font-technical text-orange mt-4 mb-12">WELCOME TO HACK IN HILLS, MANALI.</div>
              
              <div className={styles.metaBox}>
                <div className="font-technical text-cold-grey mb-2" style={{ fontSize: '0.65rem' }}>REFERENCE ID</div>
                <div className="font-technical text-xl">{regId}</div>
              </div>
            </div>
          )}

          {currentStep === 'ERROR' && (
            <div className={styles.errorState}>
              <h2 className="font-display text-snow-white">SIGNAL<br/>LOST.</h2>
              <div className="font-technical text-cold-grey mt-4 mb-12">WE COULD NOT COMPLETE YOUR REGISTRATION.</div>
              
              <button onClick={() => setCurrentStep('FINAL')} className={`${styles.btn} font-technical interactive`}>TRY AGAIN ↗</button>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
