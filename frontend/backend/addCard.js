import { auth, firestore } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const addCard = async (cardNumber, bankName, expiryDate, CVV) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User not authenticated.");
    }

    const userEmail = currentUser.email;

    const cardDocRef = doc(firestore, 'user', userEmail, 'card', bankName);

    await setDoc(cardDocRef, {
      cardNumber,
      bankName,
      expiryDate,
      CVV,
      createdAt: new Date(),
    });

    console.log('✅ Card saved with bank name as doc ID!');
  } catch (error) {
    console.error('❌ Error saving card:', error.message);
    throw error;
  }
};
