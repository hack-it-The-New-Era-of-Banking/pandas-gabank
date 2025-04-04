import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { updatePin } from '../backend/userController'; 

export default function PinSetup({ navigation }) {
  const [pin, setPin] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      console.log('❌ No user is signed in');
    }
  }, []);

  const handlePress = (num) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 6) {
        savePin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const savePin = async (newPin) => {
    try {
      if (userEmail) {
        await updatePin(userEmail, newPin);
        console.log('✅ PIN saved successfully!');
        navigation.navigate('HomePage');
      } else {
        console.error('❌ User email is not available.');
      }
    } catch (error) {
      console.error('❌ Error saving PIN:', error.message);
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[...Array(6)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index < pin.length ? 'green' : '#ccc' },
          ]}
        />
      ))}
    </View>
  );

  const renderKeypad = () => {
    const keys = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']];

    return (
      <View style={styles.keypadContainer}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={[
                  styles.keypadKey,
                  key === '' && { backgroundColor: 'transparent' },
                ]}
                onPress={() => {
                  if (key === 'del') handleDelete();
                  else if (key !== '') handlePress(key);
                }}
                disabled={key === ''}
              >
                <Text style={[styles.keypadText, key === 'del' && { fontSize: 20 }]}>
                  {key === 'del' ? '⌫' : key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/gabanklogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titletext}>Set-up your Pin.</Text>

      {renderDots()}
      {renderKeypad()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  logo: {
    width: 250,
    height: 250,
  },
  titletext: {
    fontSize: 21,
    fontWeight: '800',
    color: '#403D3D',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: '#ccc',
  },
  keypadContainer: {
    width: '80%',
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  keypadKey: {
    width: 73,
    height: 73,
    borderRadius: 50,
    backgroundColor: '#6FB513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
