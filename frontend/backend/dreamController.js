import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Fetches all dreams for the authenticated user.
 * @param {function} setDreams - A callback function to update the dreams state.
 * @returns {function} - Unsubscribe function to stop listening to Firestore updates.
 */
export const fetchDreams = (setDreams) => {
  const auth = getAuth();
  const email = auth.currentUser?.email;

  if (!email) {
    console.error('User is not authenticated.');
    return () => {};
  }

  const dreamCollection = collection(firestore, 'Dream');
  const q = query(dreamCollection, where('email', '==', email));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const dreamsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDreams(dreamsData);
  });

  return unsubscribe;
};

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

    const auth = getAuth();
    const email = auth.currentUser?.email;

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

/**
 * Adds a new dream with a generated image to the "Dream" collection.
 * @param {string} name - The name of the goal.
 * @param {number} maxProgress - The maximum progress for the goal.
 * @param {number} currentProgress - The current progress for the goal.
 * @param {string} imageUrl - The base64 encoded image URL.
 * @param {string} promptText - The prompt used to generate the image.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const addDreamWithImage = async (name, maxProgress, currentProgress, imageUrl, promptText) => {
  try {
    if (!name || maxProgress == null || currentProgress == null || !imageUrl) {
      throw new Error('All fields (name, maxProgress, currentProgress, imageUrl) are required.');
    }

    const auth = getAuth();
    const email = auth.currentUser?.email;

    if (!email) {
      throw new Error('User is not authenticated.');
    }

    const dreamCollection = collection(firestore, 'Dream');
    const newDream = {
      email,
      name,
      maxProgress,
      currentProgress,
      imageUrl,
      promptText,
      type: 'generated-image',
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(dreamCollection, newDream);
    console.log('✅ Dream with image added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding dream with image:', error);
    throw new Error('Failed to add dream with image. Please try again.');
  }
};