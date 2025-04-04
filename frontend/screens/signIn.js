import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from '../styles/signInPageStyles';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in!!');
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
      <Text>Don't have an account? <Text style={{ color: '#6FB513' }}>Sign Up</Text></Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </SafeAreaView>
  );
}

