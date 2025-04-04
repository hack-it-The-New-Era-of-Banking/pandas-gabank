import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth, firestore } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User account created!');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <Button title="Sign Up" onPress={signUp} />
    </View>
  );
}
