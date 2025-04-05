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
import { getUserCards } from "../backend/getCards";
import Header from '../components/header';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import manageCardStyles from '../styles/manageCardStyles';

const screenWidth = Dimensions.get("window").width;

export default function ManageCard({ navigation }) {
  const [balanceCards, setBalanceCards] = useState([]); // State for fetched cards
  const [totalBalance, setTotalBalance] = useState(0); // State for total balance

  useEffect(() => {
    fetchBalanceCards();
  }, []);

  const fetchBalanceCards = async () => {
    try {
      const cards = await getUserCards();
      
      console.log('Fetched Cards: fetchBalanceCards:', cards);

      if (cards.length > 0) {
        setBalanceCards(cards);

        // Calculate the total balance for "Current Balance" card
        const total = cards.reduce((acc, card) => acc + parseFloat(card.balance || 0), 0);
        setTotalBalance(total.toFixed(2));  // Set total balance to state
      } else {
        console.warn('No cards found!');
        setBalanceCards([]); // Clear the balance cards if none found
      }
    } catch (error) {
      console.error('Error fetching balance cards:', error);
      setBalanceCards([]); // Clear the balance cards on error
    }
  };

  const renderCard = ({ item, index }) => {
    const isCurrentBalance = item.id === 'current_balance'; // Check if it's the current balance card
    const gradientColors = isCurrentBalance ? ['#4CAF50', '#1B5E20'] : [item.colorStart, item.colorEnd];

    return (
      <LinearGradient colors={gradientColors} style={manageCardStyles.card}>
        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.cardTitle}>
            {isCurrentBalance ? 'Current Balance' : 'Your Balance'}
          </Text>
          <Text style={manageCardStyles.bankName}>
            {isCurrentBalance ? 'GaBank' : item.name}
          </Text>
        </View>

        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.cardBalance}>
            {isCurrentBalance ? `₱${totalBalance}` : `₱${item.balance}`}
          </Text>
        </View>
        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.cardUserName}>{item.name}</Text>
        </View>
        <View style={manageCardStyles.cardRow}>
          <Text style={manageCardStyles.accountInfo}>{item.cardNumber}</Text>
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

          {/* Debugging log */}
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Total Balance: ₱{totalBalance}</Text>

          <FlatList
            data={[{ id: 'current_balance', balance: totalBalance }, ...balanceCards]}  // Add the "Current Balance" as the first item
            renderItem={renderCard}
            keyExtractor={(item) => item.id || item.cardNumber}  // Ensure each card has a unique id or cardNumber as fallback
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
