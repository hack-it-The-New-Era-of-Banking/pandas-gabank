import { firestore } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Adds a new dream to the "Dream" collection for the authenticated user.
 * @param {string} name - The name of the goal.
 * @param {number} maxProgress - The maximum progress for the goal.
 * @param {number} currentProgress - The current progress for the goal.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const addDream = async (name, maxProgress, currentProgress) => {
  try {
    if (!name || maxProgress == null || currentProgress == null) {
      throw new Error('All fields (name, maxProgress, currentProgress) are required.');
    }

    const auth = getAuth(); // Get the Firebase Auth instance
    const email = auth.currentUser?.email; // Get the authenticated user's email

    if (!email) {
      throw new Error('User is not authenticated.');
    }

    const dreamCollection = collection(firestore, 'Dream');
    const newDream = {
      email,
      name,
      maxProgress,
      currentProgress,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(dreamCollection, newDream);
    console.log('✅ Dream added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding dream:', error);
    throw new Error('Failed to add dream. Please try again.');
  }
};