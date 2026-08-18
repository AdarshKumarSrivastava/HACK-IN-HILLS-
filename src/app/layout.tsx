import type { Metadata } from 'next'
import { Inter, Oswald, Space_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import SnowCursor from '@/components/canvas/SnowCursor'

import Navigation from '@/components/Navigation'
import SideRail from '@/components/SideRail'
import { TransitionProvider } from '@/context/TransitionContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-display' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-technical' })

export const metadata: Metadata = {
  title: 'Hack in Hills — Manali | Code at the Edge of the World',
  description: 'The most ambitious hackathon in the Himalayas. Code at the edge of the world. The mountain is the interface.',
  openGraph: {
    title: 'Hack in Hills — Manali',
    description: 'Code at the edge of the world. A premium hackathon expedition.',
    type: 'website',
    locale: 'en_IN',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${spaceMono.variable}`}>
      <body>
        <TransitionProvider>
          <SmoothScroll>
            <SnowCursor />
            <Navigation />
            <SideRail />
            {children}
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  )
}
