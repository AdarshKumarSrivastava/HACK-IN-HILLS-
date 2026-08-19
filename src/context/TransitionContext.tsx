'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

export type TransitionPhase = 'preloading' | 'transitioning' | 'complete'

export type CinematicTransitionState = 'idle' | 'entering_register' | 'exiting_register'

interface TransitionContextType {
  phase: TransitionPhase
  setPhase: (phase: TransitionPhase) => void
  transitionState: CinematicTransitionState
  startRegistrationTransition: (url: string) => void
  startExitTransition: (url: string) => void
  completeCinematicTransition: () => void
  transitionTargetUrl: string | null
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>('preloading')
  const [transitionState, setTransitionState] = useState<CinematicTransitionState>('idle')
  const [transitionTargetUrl, setTransitionTargetUrl] = useState<string | null>(null)

  const startRegistrationTransition = useCallback((url: string) => {
    setTransitionState(prev => {
      if (prev !== 'idle') return prev
      setTransitionTargetUrl(url)
      return 'entering_register'
    })
  }, [])

  const startExitTransition = useCallback((url: string) => {
    setTransitionState(prev => {
      if (prev !== 'idle') return prev
      setTransitionTargetUrl(url)
      return 'exiting_register'
    })
  }, [])

  const completeCinematicTransition = useCallback(() => {
    setTransitionState('idle')
    setTransitionTargetUrl(null)
  }, [])

  const value = useMemo(() => ({
    phase, 
    setPhase, 
    transitionState, 
    startRegistrationTransition,
    startExitTransition,
    completeCinematicTransition,
    transitionTargetUrl 
  }), [phase, transitionState, startRegistrationTransition, startExitTransition, completeCinematicTransition, transitionTargetUrl])

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}
