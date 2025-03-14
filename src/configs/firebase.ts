import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAFG4BHkwTUdRcnWq5tnIPr3Bf_jFnhsAg',
  authDomain: 'sufuricloud.firebaseapp.com',
  projectId: 'sufuricloud',
  storageBucket: 'sufuricloud.firebasestorage.app',
  messagingSenderId: '35305109481',
  appId: '1:35305109481:web:340d87635d0a711f413d78',
  measurementId: 'G-9LDRJJTV7K'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
