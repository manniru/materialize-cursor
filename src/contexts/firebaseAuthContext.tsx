'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'

import { auth } from '@configs/firebase'

interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
  logout: async () => {}
})

export const useFirebaseAuth = () => useContext(FirebaseAuthContext)

export const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return <FirebaseAuthContext.Provider value={{ user, loading, logout }}>{children}</FirebaseAuthContext.Provider>
}
