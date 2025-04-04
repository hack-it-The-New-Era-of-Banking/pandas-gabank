import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Function to handle user sign-up
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User account created!');
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

// Function to handle user sign-in
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in!');
    return userCredential;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};