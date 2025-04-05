import React, { useState, useEffect, useRef } from "react";
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
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getUserCards } from "../backend/getCards";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/header";

import BottomNavBar from "../components/bottomNavBar";

const screenWidth = Dimensions.get("window").width;

const HomePage = ({ navigation }) => {
  const [balanceCards, setBalanceCards] = useState([]);
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Home'); // initial active tab
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, []);

  const fetchUserData = async () => {
    try {
      const cards = await getUserCards();
      console.log("Fetched Cards: ", cards);

      if (cards.length > 0) {
        setBalanceCards(cards);
      } else {
        console.log("No cards found, using dummy data.");
        setBalanceCards([dummyUser]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setBalanceCards([dummyUser]);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactions(dummyTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const renderCard = ({ item, index }) => {
    try {
      console.log("Rendering card:", item);

      const gradientColors =
        index === 0
          ? ["#4CAF50", "#1B5E20"]
          : [item.colorStart || "#4CAF50", item.colorEnd || "#1B5E20"];

      return (
        <LinearGradient colors={gradientColors} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>
              {index === 0 ? "Current Balance" : "Your Balance"}
            </Text>
            <Text style={styles.bankName}>
              {item.bankName ? item.bankName : index === 0 ? "GaBank" : "Unknown Bank"}
            </Text>

          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardBalance}>₱
              {item.balance ? Number(item.balance).toFixed(2) : index === 0 ? 0.00 : 0.00}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardUserName}>
              {item.name ? item.name : index === 0 ? "Juan Dela Cruz" : "N/A"}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.accountInfo}>
              {item.cardNumber ? item.cardNumber : index === 0 ? "0000 0000 0000" : "N/A"}
            </Text>
            <Text style={styles.expiryDate}>
              {index === 0 ? "" : item.expiryDate || ""}
            </Text>
          </View>
        </LinearGradient>
      );
    } catch (err) {
      console.error("Error rendering card:", err);
      return null;
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
            data={balanceCards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            onMomentumScrollEnd={(e) => {
              const index = Math.floor(
                e.nativeEvent.contentOffset.x / screenWidth
              );
              setCurrentIndex(index);
            }}
          />

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

          <View style={styles.optionsContainer}>
            {/* Top Row (3 options) */}
            <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("ReceiveMoney")}>
                <Image source={require("../assets/receive.png")} style={styles.optionIcon} />
                <Text style={styles.optionText}>Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("SaveMoney")}>
                <Image source={require("../assets/save.png")} style={styles.optionIcon} />
                <Text style={styles.optionText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("BudgetMoney")}>
                <Image source={require("../assets/budget.png")} style={styles.optionIcon} />
                <Text style={styles.optionText}>Budget</Text>
            </TouchableOpacity>
            </View>

            {/* Bottom row centered */}
            <View style={styles.centeredRow}>
            <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("DreamScreen")}>
                <Image source={require("../assets/cloud1.png")} style={styles.optionIcon} />
                <Text style={styles.optionText}>Dream</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("HomePage")}>
                <Image source={require("../assets/assist.png")} style={styles.optionIcon} />
                <Text style={styles.optionText}>Assist</Text>
            </TouchableOpacity>
            </View>



          <Text style={styles.transactionListHead}>Your Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            style={styles.transactionsList}
          />
        </View>
      </KeyboardAvoidingView>

      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
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
    height: 200, // Fixed height
    marginBottom: 30,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cardTitle: { color: "#fff", fontSize: 14, marginBottom: 20 },
  cardBalance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  bankName: { fontSize: 16, color: "#fff", marginVertical: 10 },
  cardUserName: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 5,
    justifyContent: "flex-start",
    textAlign: "left",
    marginVertical: 10,
  },

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

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 0,
    marginTop: 5,
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
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginBottom: 5,
  },
  centeredRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 20, // optional spacing between the two
  },
  
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
  },
  optionBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    width: screenWidth / 3.7, // Smaller box
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#023126",
  },
  
  optionText: { fontSize: 14, color: "#4CAF50", marginTop: 10 },
});

export default HomePage;
