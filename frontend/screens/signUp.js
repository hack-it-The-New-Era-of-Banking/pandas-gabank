import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User account created!');
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

      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={signUp} color="#6FB513" />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    paddingHorizontal: 30,
    alignItems: 'center',
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
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
