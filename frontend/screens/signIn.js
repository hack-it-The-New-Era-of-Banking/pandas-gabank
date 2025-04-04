import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/signInPageStyles';

import { signInUser } from '../backend/authService'; // ✅ your auth service

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const signIn = async () => {
    try {
      await signInUser(email, password); // ✅ now using the service
      console.log('User signed in!!');
      navigation.navigate('SplashPage');
    } catch (error) {
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
