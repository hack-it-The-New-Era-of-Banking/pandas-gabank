import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import addCardStyles from '../styles/addCardStyles';
import Header from '../components/header'; 
import { signInUser } from '../backend/userController'; 

export default function ReceiveMoney({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
  const [sender, setSender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [cardNumberFocused, setCardNumberFocused] = useState(false);
  const [bankNameFocused, setBankNameFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [senderFocused, setSenderFocused] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState('');

  const handleReceiveMoney = async () => {
    try {
      // Combine data to be encoded in the QR
      const qrData = JSON.stringify({
        cardNumber,
        bankName,
        amount,
        sender
      });

      setQrValue(qrData); // Set data for QR code
      setModalVisible(true); // Show modal

      await signInUser(cardNumber, bankName, amount, sender);
      console.log('Money received!');
    } catch (error) {
      setErrorMessage(error.message);
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
          <Text style={addCardStyles.titletext}>Receive Money</Text>

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
              { borderBottomColor: senderFocused ? '#6FB513' : '#ccc' },
            ]}
            placeholder="Sender"
            onChangeText={setSender}
            value={sender}
            autoCapitalize="words"
            onFocus={() => setSenderFocused(true)}
            onBlur={() => setSenderFocused(false)}
          />

          <TouchableOpacity style={addCardStyles.loginbtn} onPress={handleReceiveMoney}>
            <Text style={addCardStyles.buttonText}>Receive</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={addCardStyles.errorText}>{errorMessage}</Text>
          ) : null}

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <View style={{
                width: 300,
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 800 }}>Generated QR</Text>
                <QRCode value={qrValue} size={200} />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: '#6FB513',
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: '#fff' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
