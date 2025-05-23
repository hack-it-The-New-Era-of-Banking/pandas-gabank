import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase credentials
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Debugging log to check if Firestore is initialized
console.log('✅ Firestore Initialized:', firestore);

export { auth, firestore };
