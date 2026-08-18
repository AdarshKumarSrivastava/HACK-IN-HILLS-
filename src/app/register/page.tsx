import { Suspense } from 'react'
import RegistrationModal from '@/components/registration/RegistrationModal'

export const metadata = {
  title: 'Register | Hack in Hills',
  description: 'Enter the expedition.',
}

export default function RegisterPage() {
  return (
    <main>
      <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#050506' }}></div>}>
        <RegistrationModal />
      </Suspense>
    </main>
  )
}
