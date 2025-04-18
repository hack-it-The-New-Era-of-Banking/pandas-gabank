// budgetPlan.js
import { auth, firestore } from '../config/firebaseConfig'; // Adjust if needed
import { doc, setDoc } from 'firebase/firestore';

export const saveSalary = async (salary) => {
  try {
    const user = auth.currentUser; // Get the current logged-in user
    if (!user) {
      console.error('No user is currently authenticated.');
      return;
    }

    const userEmail = user.email; // Get user's email
    const salaryRef = doc(firestore, 'Salary', userEmail);
    
    // Set the salary in the Firestore document
    await setDoc(salaryRef, {
      salary: salary,
    });

    console.log('Salary saved successfully!');
  } catch (error) {
    console.error('Error saving salary:', error);
  }
};
