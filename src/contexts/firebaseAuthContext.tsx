'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signOut,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth'

import { auth } from '@configs/firebase'

interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  updateEmail: async () => {},
  updatePassword: async () => {}
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

  const updateProfile = async (displayName: string, photoURL?: string) => {
    if (!user) throw new Error('No user logged in')

    try {
      await firebaseUpdateProfile(user, {
        displayName,
        photoURL: photoURL || user.photoURL
      })

      // Update the local user state to reflect changes
      setUser({ ...user, displayName, photoURL: photoURL || user.photoURL })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error sending password reset email:', error)
      throw error
    }
  }

  const updateEmail = async (email: string) => {
    if (!user) throw new Error('No user logged in')

    try {
      await firebaseUpdateEmail(user, email)
    } catch (error) {
      console.error('Error updating email:', error)
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    if (!user) throw new Error('No user logged in')

    try {
      await firebaseUpdatePassword(user, password)
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        logout,
        updateProfile,
        resetPassword,
        updateEmail,
        updatePassword
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  )
}
