'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type TransitionPhase = 'preloading' | 'transitioning' | 'complete'

interface TransitionContextType {
  phase: TransitionPhase
  setPhase: (phase: TransitionPhase) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>('preloading')

  return (
    <TransitionContext.Provider value={{ phase, setPhase }}>
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
