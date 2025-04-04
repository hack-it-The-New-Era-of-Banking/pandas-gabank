import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { signUpUser } from '../backend/authService';
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await signUpUser(email, password);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}