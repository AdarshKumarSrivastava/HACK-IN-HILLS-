/* eslint-disable @next/next/no-img-element */
'use client'

import styles from './Judges.module.css'

const judges = [
  { id: '01', name: 'Dr. Aditi Sharma', role: 'AI RESEARCHER', company: 'DEEPMIND', track: 'INTELLIGENCE', img: '/images/judge_1.jpg' },
  { id: '02', name: 'Vikram Singh', role: 'CHIEF ARCHITECT', company: 'POLYGON', track: 'DECENTRALIZATION', img: '/images/judge_2.jpg' },
  { id: '03', name: 'Elena Rostova', role: 'SECURITY LEAD', company: 'PALANTIR', track: 'DEFENSE', img: '/images/judge_3.jpg' },
  { id: '04', name: 'James Chen', role: 'TECH DIRECTOR', company: 'EPIC GAMES', track: 'DIGITAL WORLDS', img: '/images/judge_4.jpg' }
]

export default function Judges() {
  return (
    <section id="people" className={styles.judgesSection}>
      {/* Premium Cinematic Abstract Background */}
      <div className={styles.backgroundLayer}>
        <div className={styles.bgImage}></div>
        <div className={styles.darkOverlay}></div>
        <div className={styles.ambientLight}></div>
        <div className={styles.microGrain}></div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
        <div className={styles.sectionMarker}>
          <span className="font-technical text-orange">05 /</span>
          <span className="font-technical text-cold-grey"> PEOPLE</span>
        </div>
        <h2 className="font-display">THE MENTORS</h2>
        <p className="font-technical">INDUSTRY EXPERTS & JUDGES</p>
      </div>

      <div className={styles.grid}>
        {judges.map(judge => (
          <div key={judge.id} className={`${styles.judgeBlock} interactive`}>
            <div className={styles.imageWrapper}>
              <img src={judge.img} alt={judge.name} className={styles.image} />
            </div>
            
            <div className={styles.metadata}>
              <span className="font-technical text-orange">JUDGE {judge.id}</span>
              <span className="font-technical">{judge.track}</span>
            </div>
            
            <div className={styles.info}>
              <h3 className="font-display">{judge.name}</h3>
              <p className={`${styles.role} font-body`}>{judge.role}</p>
              <p className={`${styles.company} font-technical`}>{judge.company}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
