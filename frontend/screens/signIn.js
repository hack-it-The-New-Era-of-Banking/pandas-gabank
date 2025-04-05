import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from '../styles/signUpPageStyles';
import { signInUser } from '../backend/userController'; // Assuming this is your sign-in service
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { firestore } from '../config/firebaseConfig'; // Assuming firestore is your Firestore instance

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const signIn = async () => {
    try {
      // Sign in the user
      await signInUser(email, password);
      console.log('User signed in!!');
  
      // Wait for 2 seconds to show the modal before navigating
      setTimeout(async () => {
        // Check if the user has a PIN set by querying Firestore
        const userDoc = await getDoc(doc(firestore, 'user', email));
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const hasPin = userData.Pin; // Assuming 'Pin' field exists in user document
  
          // Navigate based on PIN status
          if (hasPin) {
            // If user has a PIN, navigate to HomePage
            navigation.navigate('DreamScreen');
          } else {
            // If user does not have a PIN, navigate to PinSetup
            navigation.navigate('PinSetup');
          }
        } else {
          console.error('User not found in Firestore.');
        }
      }, 0); 
    } catch (error) {
      console.error('Error signing in:', error.message);
      setErrorMessage(error.message);
      setModalMessage(error.message);
      setIsSuccess(false);
      setModalVisible(true);
    }
  };
  
  
  

  return (
    <SafeAreaView style={styles.innerContainer}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      
        <Image
          source={require('../assets/gabanklogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titletext}>Login to your Account</Text>

        {/* Email Input */}
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: focusField === 'email' ? '#6FB513' : '#ccc' },
          ]}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusField('email')}
          onBlur={() => setFocusField('')}
        />

        {/* Password Input */}
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: focusField === 'password' ? '#6FB513' : '#ccc' },
          ]}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
          value={password}
          onFocus={() => setFocusField('password')}
          onBlur={() => setFocusField('')}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginbtn} onPress={signIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text>
          Don't have an account?{' '}
          <Text style={{ color: '#6FB513' }} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>

        </KeyboardAvoidingView>
      </SafeAreaView>
    
  );
}
