import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBgwCXrzEdb5wuxjxX8lpXknTOfod_x2YI',
  authDomain: 'esyscloud.firebaseapp.com',
  projectId: 'esyscloud',
  storageBucket: 'esyscloud.firebasestorage.app',
  messagingSenderId: '1016569077190',
  appId: '1:1016569077190:web:43e6b49ba3f64f14a9a6c7',
  measurementId: 'G-32TQQZ4NL2'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
