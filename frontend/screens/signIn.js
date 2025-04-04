import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/signUpPageStyles';
import { signInUser } from '../backend/userController'; // Assuming this is your sign-in service
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { firestore } from '../config/firebaseConfig'; // Assuming firestore is your Firestore instance

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const signIn = async () => {
    try {
      // Sign in the user
      await signInUser(email, password);
      console.log('User signed in!!');

      // Check if the user has a PIN set by querying Firestore
      const userDoc = await getDoc(doc(firestore, 'user', email));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const hasPin = userData.Pin; // Assuming 'pin' field exists in user document

        if (hasPin) {
          // If user has a PIN, navigate to HomePage
          navigation.navigate('HomePage');
        } else {
          // If user does not have a PIN, navigate to PinSetup
          navigation.navigate('PinSetup');
        }
      } else {
        console.error('User not found in Firestore.');
        setErrorMessage('User not found.');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/gabanklogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titletext}>Login to your Account</Text>

      <TextInput
        style={[
          styles.input,
          { borderBottomColor: emailFocused ? '#6FB513' : '#ccc' },
        ]}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
      />

      <TextInput
        style={[
          styles.input,
          { borderBottomColor: passwordFocused ? '#6FB513' : '#ccc' },
        ]}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
      />

      <TouchableOpacity style={styles.loginbtn} onPress={signIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text>
        Don't have an account? <Text style={{ color: '#6FB513' }}>Sign Up</Text>
      </Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </SafeAreaView>
  );
}
