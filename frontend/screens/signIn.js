import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
      <Text>Don't have an account? <Text>Sign Up</Text></Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '80%',
    marginTop: 80,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  titletext: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 20,
    color: '403D3D',
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 2,
    paddingHorizontal: 5,
    fontSize: 16,
    marginBottom: 25,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  loginbtn: {
    marginTop: 240,
    backgroundColor: '#6FB513',
    paddingVertical: 12,
    paddingHorizontal: 77,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
