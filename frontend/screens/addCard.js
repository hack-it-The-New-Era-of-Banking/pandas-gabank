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
import { addCard } from '../backend/addCard'; // ✅ use your Firestore card saving function

export default function AddCard({ navigation }) {
  const [cardNumber, setcardNumber] = useState('');
  const [bankName, setbankName] = useState('');
  const [expiryDate, setexpiryDate] = useState('');
  const [cvv, setcvv] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [cardNumberFocused, setcardNumberFocused] = useState(false);
  const [bankNameFocused, setbankNameFocused] = useState(false);
  const [expiryDateFocused, setexpiryDateFocused] = useState(false);
  const [cvvFocused, setcvvFocused] = useState(false);

  const handleAddCard = async () => {
    try {
      await addCard(cardNumber, bankName, expiryDate, cvv);
      console.log('✅ Card Created!');
      navigation.navigate('HomePage'); // or any other screen you want
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleExpiryInput = (text) => {
    let formatted = text.replace(/[^0-9]/g, '');

    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
    }

    setexpiryDate(formatted);
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
          <Text style={addCardStyles.titletext}>Add Card</Text>

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: cardNumberFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Card Number"
            onChangeText={setcardNumber}
            value={cardNumber}
            keyboardType="number-pad"
            autoCapitalize="none"
            onFocus={() => setcardNumberFocused(true)}
            onBlur={() => setcardNumberFocused(false)}
          />

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: bankNameFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Bank's Name"
            onChangeText={setbankName}
            value={bankName}
            onFocus={() => setbankNameFocused(true)}
            onBlur={() => setbankNameFocused(false)}
          />

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: expiryDateFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Expiry Date (MM/YY)"
            onChangeText={handleExpiryInput}
            value={expiryDate}
            maxLength={5}
            keyboardType="number-pad"
            onFocus={() => setexpiryDateFocused(true)}
            onBlur={() => setexpiryDateFocused(false)}
          />

          <TextInput
            style={[
              addCardStyles.input,
              { borderBottomColor: cvvFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Card Verification Value"
            onChangeText={setcvv}
            value={cvv}
            keyboardType="number-pad"
            autoCapitalize="none"
            onFocus={() => setcvvFocused(true)}
            onBlur={() => setcvvFocused(false)}
          />

          <TouchableOpacity style={addCardStyles.loginbtn} onPress={handleAddCard}>
            <Text style={addCardStyles.buttonText}>Add Card</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={addCardStyles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
