import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6JqPW_I7LSOlSBwhI8d9CSWHGB-x_1FY",
  authDomain: "fintech-hackathon-815ee.firebaseapp.com",
  projectId: "fintech-hackathon-815ee",
  storageBucket: "fintech-hackathon-815ee.firebasestorage.app",
  messagingSenderId: "1035274264435",
  appId: "1:1035274264435:android:96862677306ed8aa292f06"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
