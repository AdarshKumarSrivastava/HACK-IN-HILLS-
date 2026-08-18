'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Tracks.module.css'

gsap.registerPlugin(ScrollTrigger)

const tracks = [
  { 
    id: '01', 
    title: 'INTELLIGENCE', 
    subtitle: 'AI / ML',
    desc: 'Train models at high altitude. Build intelligent systems that push the boundaries of machine learning.',
    tech: 'TensorFlow, PyTorch, OpenAI, Hugging Face',
    prize: '₹25,000 + AI API Credits',
    pos: { top: '80%', left: '45%' }
  },
  { 
    id: '02', 
    title: 'DECENTRALIZATION', 
    subtitle: 'WEB3 / BLOCKCHAIN',
    desc: 'Build trustless systems. Create decentralized applications that redefine digital ownership.',
    tech: 'Solidity, Rust, IPFS, Polygon',
    prize: '₹25,000 + Polygon Grants',
    pos: { top: '65%', left: '35%' }
  },
  { 
    id: '03', 
    title: 'DEFENSE', 
    subtitle: 'CYBERSECURITY',
    desc: 'Fortify the network. Identify vulnerabilities and build resilient cryptographic architectures.',
    tech: 'Wireshark, Metasploit, Cryptography, Network Security',
    prize: '₹20,000 + Security Certifications',
    pos: { top: '55%', left: '55%' }
  },
  { 
    id: '04', 
    title: 'DIGITAL WORLDS', 
    subtitle: 'GAME DEV / AR / VR',
    desc: 'Construct new realities. Render immersive environments and interactive experiences.',
    tech: 'Unity, Unreal Engine, Three.js, WebXR',
    prize: '₹20,000 + Hardware Access',
    pos: { top: '45%', left: '42%' }
  },
  { 
    id: '05', 
    title: 'FRONTIER', 
    subtitle: 'OPEN INNOVATION',
    desc: 'No limits. Build whatever you want. If it solves a real problem, it belongs on the frontier.',
    tech: 'Any technology stack',
    prize: '₹30,000 Grand Prize',
    pos: { top: '30%', left: '48%' }
  }
]

export default function Tracks() {
  const [activeTrack, setActiveTrack] = useState<number>(0)
  const [displayedTrack, setDisplayedTrack] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  
  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const detailRef = useRef<HTMLDivElement>(null)

  // Scroll Reveal Animation
  useEffect(() => {
    if (!sectionRef.current || !navRef.current || !detailRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%'
          }
        })

        // Stagger in the layout sequentially
        tl.fromTo(navRef.current, 
          { opacity: 0, x: -20 }, 
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo(navItemsRef.current, 
          { opacity: 0, x: -10 }, 
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, 
          '-=0.4'
        )
        .fromTo(detailRef.current, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
          '-=0.4'
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Track Switching Logic
  const handleTrackChange = (index: number) => {
    if (index === activeTrack || isTransitioning) return
    setActiveTrack(index)
    setIsTransitioning(true)
    
    // Animate out
    gsap.to(detailRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setDisplayedTrack(index)
        // Animate in
        gsap.fromTo(detailRef.current, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => setIsTransitioning(false) }
        )
      }
    })
  }

  const router = useRouter()

  const handleRegister = (track: typeof tracks[0]) => {
    router.push(`/register?track=${encodeURIComponent(track.subtitle)}`)
  }

  return (
    <section id="tracks" ref={sectionRef} className={styles.tracksSection}>
      
      {/* Exact Match Background */}
      <div className={styles.backgroundLayer}>
        <div className={styles.bgImageWrapper}>
          <img 
            src="/images/tracks-bg-abstract.png" 
            alt="Tracks Atmospheric Background" 
            className={styles.bgImage}
          />
        </div>
        <div className={styles.darkOverlay}></div>
        
        {/* Micro Metadata */}
        <div className={`${styles.metadataMarker} ${styles.topLeft}`}>
          ROAD &nbsp; → &nbsp; <span className="text-orange">JOURNEY</span> &nbsp; → &nbsp; CHALLENGE &nbsp; → &nbsp; SUMMIT
        </div>
        <div className={`${styles.metadataMarker} ${styles.topRight}`}>H.IH / 26</div>
        <div className={`${styles.metadataMarker} ${styles.bottomRight}`}>32°14'N &nbsp; 77°11'E &nbsp; —</div>
      </div>

      <div className={styles.contentWrapper}>
        
        {/* Far Left Global Navigation Path */}
        <div className={styles.globalNavPath}>
          <div className={styles.globalPathLine}></div>
          <div className={styles.globalNode}></div>
          <div className={`${styles.globalNode} ${styles.activeGlobalNode}`}>
            <div className={styles.globalLabel}>
              <span className="text-orange">02</span>
              <br />
              CHALLENGES
            </div>
          </div>
          <div className={styles.globalNode}></div>
          <div className={styles.globalNode}></div>
          <div className={styles.globalNode}></div>
        </div>

        {/* Center Floating Waypoint Map */}
        <div className={styles.waypointMap}>
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              className={`${styles.waypoint} ${activeTrack === index ? styles.active : ''} interactive`}
              style={{ top: track.pos.top, left: track.pos.left }}
              onClick={() => handleTrackChange(index)}
            >
              <div className={styles.waypointIndicator}>
                <div className={styles.waypointRing}></div>
                <div className={styles.waypointCore}></div>
              </div>
              <div className={styles.waypointLabel}>
                {track.id}. {track.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right Information Panel */}
        <div className={styles.rightPanel}>
           <div ref={detailRef} className={styles.detailCard}>
              <div className={`${styles.detailId} font-technical text-orange`}>TRACK {tracks[displayedTrack].id}</div>
              <h3 className="font-display">{tracks[displayedTrack].title}</h3>
              <div className={`${styles.detailSubtitle} font-technical`}>{tracks[displayedTrack].subtitle}</div>
              
              <p className={styles.desc}>{tracks[displayedTrack].desc}</p>
              
              <div className={styles.metaDataGrid}>
                <div className={styles.metaBox}>
                  <div className="font-technical text-cold-grey" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>SUGGESTED TECHNOLOGIES</div>
                  <div className="font-technical">{tracks[displayedTrack].tech}</div>
                </div>

                <div className={styles.metaBox}>
                  <div className="font-technical text-cold-grey" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>RELEVANT PRIZE</div>
                  <div className="font-technical text-orange">{tracks[displayedTrack].prize}</div>
                </div>
              </div>

              <button 
                className={`${styles.registerBtn} font-technical interactive`}
                onClick={() => handleRegister(tracks[displayedTrack])}
              >
                <div className={styles.btnContent}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.25rem' }}>READY TO CLIMB?</span>
                  <span className="text-orange">REGISTER FOR THIS TRACK <span className={styles.btnArrow}>↗</span></span>
                </div>
              </button>
           </div>
        </div>

      </div>
    </section>
  )
}
