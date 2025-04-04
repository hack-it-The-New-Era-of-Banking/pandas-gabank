import { auth, firestore } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


// Function to handle user sign-up
export const signUpUser = async (email, firstName, lastName, mobile, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(firestore, 'user', email), {
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
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

// After signing up make a function that gets the PIN number that is associated to the email registered


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
