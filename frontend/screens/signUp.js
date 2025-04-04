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
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '80%',
    marginTop: 60,
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
  loginbtn: {
    marginTop: 40,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  halfInput: {
    width: '48%',
    height: 50,
    borderBottomWidth: 2,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  
});
