import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

export const getUserCards = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No authenticated user found.");
      return [];
    }

    const userDocRef = doc(db, "user", user.email);

    // Fetch user's firstName and lastName
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.exists() ? userDocSnap.data() : {};
    const fullName = `${userData.firstName || "User"} ${userData.lastName || "Name"}`;

    const cardCollectionRef = collection(userDocRef, "card");
    const cardSnapshot = await getDocs(cardCollectionRef);

    const cards = cardSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: fullName, // Use full name from user document
        cardNumber: data.cardNumber || "0000 0000 0000 0000",
        bankName: data.bankName || "GaBank",
        expiryDate: data.expiryDate || "--/--",
        contact: data.contact || "0000 000 0000",
        balance: data.balance || (Math.random() * (25000 - 5000) + 5000).toFixed(2),
        colorStart: data.colorStart || "#4CAF50",
        colorEnd: data.colorEnd || "#1B5E20"
      };
    });

    console.log("Fetched Cards: ", cards);
    return cards;
  } catch (error) {
    console.error("Error fetching cards from subcollection:", error);
    return [];
  }
};
