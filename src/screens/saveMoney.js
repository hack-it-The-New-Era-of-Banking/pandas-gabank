import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform
} from 'react-native';
import addCardStyles from '../styles/addCardStyles';
import Header from '../components/header';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';
import BottomNavBar from '../components/bottomNavBar'; 


export default function SaveMoney({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
  const [allocatedArea, setAllocatedArea] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
const [activeTab, setActiveTab] = useState('Save'); // initial active tab
  const [cardNumberFocused, setCardNumberFocused] = useState(false);
  const [bankNameFocused, setBankNameFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [allocatedAreaFocused, setAllocatedAreaFocused] = useState(false);

  const handleSaveMoney = async () => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        setErrorMessage('No user logged in.');
        return;
      }
  
      const dataToSave = {
        cardNumber,
        bankName,
        amount,
        allocatedArea,
        email: user.email, 
        createdAt: Timestamp.now()
      };
  
      await addDoc(collection(firestore, 'savedMoney'), dataToSave);
      setErrorMessage('');
      console.log('✅ Money saved successfully!');
      
      // Optionally clear inputs
      setCardNumber('');
      setBankName('');
      setAmount('');
      setAllocatedArea('');
      
    } catch (error) {
      console.error('❌ Error saving money:', error);
      setErrorMessage('Failed to save money. Please try again.');
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Header />
        <View style={addCardStyles.container}>
          <Text style={addCardStyles.titletext}>Save Money</Text>

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: cardNumberFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Card Number"
            onChangeText={setCardNumber}
            value={cardNumber}
            keyboardType="number-pad"
            onFocus={() => setCardNumberFocused(true)}
            onBlur={() => setCardNumberFocused(false)}
          />

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: bankNameFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Bank's Name"
            onChangeText={setBankName}
            value={bankName}
            onFocus={() => setBankNameFocused(true)}
            onBlur={() => setBankNameFocused(false)}
          />

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: amountFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Amount"
            onChangeText={setAmount}
            value={amount}
            keyboardType="numeric"
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
          />

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: allocatedAreaFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Allocated Area"
            onChangeText={setAllocatedArea}
            value={allocatedArea}
            autoCapitalize="words"
            onFocus={() => setAllocatedAreaFocused(true)}
            onBlur={() => setAllocatedAreaFocused(false)}
          />

          <TouchableOpacity style={addCardStyles.loginbtn} onPress={handleSaveMoney}>
            <Text style={addCardStyles.buttonText}>Save</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={addCardStyles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}
