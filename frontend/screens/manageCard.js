import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../config/firebaseConfig';
import Header from '../components/header';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import manageCardStyles from '../styles/manageCardStyles'; // Import the separated styles

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();
const screenWidth = Dimensions.get("window").width;

const dummyBalanceCards = [
  {
    id: '1',
    balance: '10,500.00',
    name: 'Main Account',
    accountNumber: '1234 5678 9012 3456',
    expiryDate: '12/28',
    colorStart: '#4CAF50',
    colorEnd: '#1B5E20',
  },
  {
    id: '2',
    balance: '5,200.75',
    name: 'Savings Account',
    accountNumber: '9876 5432 1098 7654',
    expiryDate: '11/27',
    colorStart: '#FF9800',
    colorEnd: '#F57C00',
  },
  {
    id: '3',
    balance: '3,800.00',
    name: 'Travel Fund',
    accountNumber: '1111 2222 3333 4444',
    expiryDate: '06/26',
    colorStart: '#2196F3',
    colorEnd: '#1976D2',
  },
];

export default function ManageCard({ navigation }) {
  const [balanceCards, setBalanceCards] = useState(dummyBalanceCards);

  useEffect(() => {
    fetchBalanceCards();
  }, []);

  const fetchBalanceCards = async () => {
    try {
      const cardDocs = await getDocs(collection(db, 'users'));
      const cards = [];
      cardDocs.forEach((doc) => {
        const data = doc.data();
        cards.push({
          id: doc.id,
          balance: data.balance,
          name: data.name,
          contact: data.contact,
          accountNumber: data.accountNumber || '',
          expiryDate: data.expiryDate || '',
          colorStart: data.colorStart || '#4CAF50',
          colorEnd: data.colorEnd || '#1B5E20',
        });
      });

      if (cards.length > 0) {
        setBalanceCards(cards);
      }
    } catch (error) {
      console.error('Error fetching balance cards:', error);
    }
  };

  const renderCard = ({ item, index }) => {
    const gradientColors = index === 0 ? ['#4CAF50', '#1B5E20'] : [item.colorStart, item.colorEnd];

    return (
      <LinearGradient colors={gradientColors} style={manageCardStyles.card}>
        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.cardTitle}>
            {index === 0 ? 'Current Balance' : 'Your Balance'}
          </Text>
          <Text style={manageCardStyles.bankName}>
            {index === 0 ? 'GaBank' : item.name}
          </Text>
        </View>

        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.cardBalance}>₱{item.balance}</Text>
        </View>
        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.cardUserName}>{item.name}</Text>
        </View>
        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.accountInfo}>{item.accountNumber}</Text>
          <Text style={manageCardStyles.expiryDate}>{item.expiryDate}</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Header />
        <View style={manageCardStyles.container}>
          <Text style={manageCardStyles.titletext}>Manage Cards</Text>

          <View style={manageCardStyles.selectCardRow}>
            <Text style={manageCardStyles.selectCardText}>Select a card</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
              <Icon name="add-circle-outline" size={24} color="#6FB513" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={balanceCards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 10 }}
            contentContainerStyle={{
              paddingBottom: 20,
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
