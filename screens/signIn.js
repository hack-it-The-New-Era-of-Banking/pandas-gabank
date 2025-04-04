import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signInUser } from '../backend/authService';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      await signInUser(email, password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <Button title="Sign In" onPress={handleSignIn} />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
    </View>
  );
}