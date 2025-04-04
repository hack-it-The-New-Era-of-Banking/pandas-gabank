import { auth, firestore } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Helper to make email safe for Firestore document ID
const makeSafeEmailId = (email) => email.replace(/\./g, '_').replace(/@/g, '_at_');

// Function to handle user sign-up
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const safeEmail = email.replace(/\./g, '_').replace(/@/g, '_at_');

    console.log('🚀 User created:', user.email);
    console.log('🔥 Trying to save user in Firestore...');

    await setDoc(doc(firestore, 'users', safeEmail), {
      email: user.email,
      createdAt: new Date(),
    }).then(() => {
      console.log('✅ User saved in Firestore successfully!');
    }).catch((error) => {
      console.error('❌ Firestore write error:', error);
    });

    return userCredential;
  } catch (error) {
    console.error('❌ Error signing up:', error.message);
    throw error;
  }
};


// Function to handle user sign-in
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User signed in successfully!');
    return userCredential;
  } catch (error) {
    console.error('❌ Error signing in:', error.message);
    throw error;
  }
};
