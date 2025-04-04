import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "../config/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/header'; // Import the Header component
// import BottomNavBar from '../components/bottomNavBar';
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();
const screenWidth = Dimensions.get("window").width;

const HomePage = () => {
  const [balanceCards, setBalanceCards] = useState([dummyUser]); // Start with dummy data
  const [transactions, setTransactions] = useState(dummyTransactions); // Start with dummy data
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDocs = await getDocs(collection(db, "users"));
      const users = [];
      userDocs.forEach((doc) => {
        const data = doc.data();
        users.push({
            id: doc.id,
            balance: data.balance,
            name: data.name,
            contact: data.contact,
            accountNumber: data.accountNumber || '',
            expiryDate: data.expiryDate || '',
            colorStart: data.colorStart || '#4CAF50',  // fallback if not set
            colorEnd: data.colorEnd || '#1B5E20',
          });
          
      });
      console.log("Fetched users: ", users); // Log the fetched user data
      setBalanceCards(users.length ? users : [dummyUser]); // Fallback to dummy data if no users
    } catch (error) {
      console.error("Error fetching user data:", error);
      setBalanceCards([dummyUser]); // Fallback to dummy data on error
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactionDocs = await getDocs(collection(db, "transactions"));
      const transactionsArray = [];
      transactionDocs.forEach((doc) => {
        transactionsArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsArray.length ? transactionsArray : dummyTransactions); // Fallback to dummy data if no transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions(dummyTransactions); // Fallback to dummy data on error
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Icon name="money" size={20} color="#4CAF50" />
      <View style={styles.transactionText}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  const renderCard = ({ item, index }) => {
    const gradientColors =
      index === 0
        ? ["#4CAF50", "#1B5E20"] // Fixed gradient for the first card
        : [item.colorStart || "#4CAF50", item.colorEnd || "#1B5E20"]; // User-defined or fallback
  
    return (
      <LinearGradient colors={gradientColors} style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardTitle}>
            {index === 0 ? "Current Balance" : "Your Balance"}
          </Text>
          <Text style={styles.bankName}>
            {index === 0 ? "GaBank" : item.name}
          </Text>
        </View>
  
        <View style={styles.cardRow}>
          <Text style={styles.cardBalance}>₱{item.balance}</Text>
        </View>
        <View style={styles.cardRow}>
            <Text style={styles.cardUserName}>{item.name}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.accountInfo}>
            {index === 0 ? item.contact : item.accountNumber}
          </Text>
          <Text style={styles.expiryDate}>
            {index === 0 ? "" : item.expiryDate}
          </Text>
        </View>
      </LinearGradient>
    );
  };
  
  const flatListRef = React.useRef(null);

  const handleDotPress = (index) => {
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };
  

  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Header /> 
        <View style={styles.container}>
          

          <FlatList
          ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={balanceCards} // This will render either the fetched or dummy data
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            onMomentumScrollEnd={(e) => {
                const contentOffsetX = e.nativeEvent.contentOffset.x;
                const index = Math.floor(contentOffsetX / screenWidth); // Calculate the current index
                setCurrentIndex(index); // Update the active index
            }}
            />

          {/* Circle Indicators */}
          <View style={styles.dotContainer}>
            {balanceCards.map((_, index) => (
                <TouchableOpacity
                key={index}
                style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                ]}
                onPress={() => handleDotPress(index)}
                />
            ))}
            </View>

        {/* Option Boxes */}
        <View style={styles.optionsContainer}>
        <View style={styles.optionBox}>
            <Image source={require('../assets/receive.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>Receive</Text>
        </View>
            <View style={styles.optionBox}>
            <Image source={require('../assets/save.png')} style={styles.optionIcon} />
        <Text style={styles.optionText}>Save</Text>
        </View>
            <View style={styles.optionBox}>
            <Image source={require('../assets/budget.png')} style={styles.optionIcon} />
        <Text style={styles.optionText}>Budget</Text>
        </View>

          </View>
          <Text style={styles.transactionListHead}>Your Transactions</Text>
          <FlatList
            data={transactions} // This will render either the fetched or dummy data
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            style={styles.transactionsList}
          />          
        </View>
        {/* <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const dummyUser = {
  id: "dummy",
  balance: "0.00",
  name: "User Name",
  contact: "0000 000 0000",
 
};

const dummyTransactions = [
  { id: "1", type: "Receive Money", amount: "-₱280", time: "7:33 PM" },
  { id: "2", type: "Save Money", amount: "+₱280", time: "7:33 PM" },
  { id: "3", type: "Receive Money", amount: "-₱280", time: "7:33 PM" },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  card: {
    width: screenWidth - 40,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    height: "90%",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    
  },
  cardTitle: { color: "#fff", fontSize: 14, marginBottom: 20 },
  cardBalance: { fontSize: 32, fontWeight: "bold", color: "#fff", marginVertical:10 },
  bankName: { fontSize: 16, color: "#fff", marginVertical:10},
  cardUserName: { fontSize: 18, color: "#fff", marginVertical: 5, justifyContent: "flex-start", textAlign: "left", marginVertical:10 },

  accountInfo: { fontSize: 14, color: "#fff" },
  expiryDate: { fontSize: 14, color: "#fff" },

  transactionsList: { marginTop: 10 },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  transactionText: { flex: 1, marginLeft: 10 },
  transactionType: { fontSize: 16 },
  transactionTime: { fontSize: 12, color: "gray" },
  transactionAmount: { fontSize: 16, fontWeight: "bold" },

  transactionListHead: {
    fontSize: 16,
    marginTop: 15,
  },

  // Circle Dot Indicators
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 0,
    marginTop: -15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  optionIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  
  // Option Boxes
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  optionBox: {
    alignItems: "center",
    justifyContent: "center",
    
    padding: 20,
    borderRadius: 10,
    width: screenWidth / 3 - 30,
    borderWidth: 1,
    border:1,
    borderColor: "#023126"
  },
  optionText: { fontSize: 14, color: "#4CAF50", marginTop: 10 },
});

export default HomePage;
