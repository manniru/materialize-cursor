'use client'

import { useState, useEffect } from 'react'

import { collection, getDocs, query, orderBy } from 'firebase/firestore'

import { db } from '@/configs/firebase'
import type { Account } from '@/types/account'

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsRef = collection(db, 'accounts')
        const q = query(accountsRef, orderBy('created_at', 'desc'))
        const querySnapshot = await getDocs(q)

        const accountsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          created_at: doc.data().created_at?.toDate(),
          id: doc.id
        })) as Account[]

        setAccounts(accountsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  return { accounts, loading, error }
}
