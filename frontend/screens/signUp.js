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
import { signUpUser } from '../backend/authService'; 

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [focusField, setFocusField] = useState('');

  const signUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Use the signUpUser function from authService
      const userCredential = await signUpUser(email, firstName, lastName, mobile, password);
      console.log('🚀 User account created:', userCredential.user.email);
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
      <Text style={styles.titletext}>Create an Account</Text>

      <View style={styles.rowContainer}>
        <TextInput
          style={[
            styles.halfInput,
            { borderBottomColor: focusField === 'firstName' ? '#6FB513' : '#ccc' },
          ]}
          placeholder="First Name"
          onChangeText={setFirstName}
          value={firstName}
          onFocus={() => setFocusField('firstName')}
          onBlur={() => setFocusField('')}
        />
        <TextInput
          style={[
            styles.halfInput,
            { borderBottomColor: focusField === 'lastName' ? '#6FB513' : '#ccc' },
          ]}
          placeholder="Last Name"
          onChangeText={setLastName}
          value={lastName}
          onFocus={() => setFocusField('lastName')}
          onBlur={() => setFocusField('')}
        />
      </View>


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

      <TextInput
        style={[
          styles.input,
          { borderBottomColor: focusField === 'mobile' ? '#6FB513' : '#ccc' },
        ]}
        placeholder="Mobile Number"
        onChangeText={setMobile}
        value={mobile}
        keyboardType="phone-pad"
        onFocus={() => setFocusField('mobile')}
        onBlur={() => setFocusField('')}
      />

      <TextInput
        style={[
          styles.input,
          { borderBottomColor: focusField === 'password' ? '#6FB513' : '#ccc' },
        ]}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        onFocus={() => setFocusField('password')}
        onBlur={() => setFocusField('')}
      />

      <TextInput
        style={[
          styles.input,
          { borderBottomColor: focusField === 'confirmPassword' ? '#6FB513' : '#ccc' },
        ]}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        onFocus={() => setFocusField('confirmPassword')}
        onBlur={() => setFocusField('')}
      />

      <TouchableOpacity style={styles.loginbtn} onPress={signUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text>Already have an account? <Text style={{ color: '#6FB513' }}>Sign In</Text></Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </SafeAreaView>
  );
}
