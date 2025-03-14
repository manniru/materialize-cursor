'use client'

// Third-party Imports
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { useFirebaseAuth } from '@/contexts/firebaseAuthContext'

export default function AuthGuard({ children }: ChildrenType) {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return <>{user ? children : <AuthRedirect />}</>
}
