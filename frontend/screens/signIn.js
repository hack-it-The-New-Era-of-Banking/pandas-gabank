import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from '../styles/signInPageStyles';
import { signInUser } from '../backend/userController';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const signIn = async () => {
    try {
      await signInUser(email, password);
      setModalMessage('Login Successful! 🎉');
      setIsSuccess(true);
      setModalVisible(true);
      console.log('User signed in!!');
      navigation.navigate('PinSetup');

      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('SplashPage');
      }, 2000);

    } catch (error) {
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

        {/* ✅ Custom Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, isSuccess ? styles.successModal : styles.errorModal]}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    
  );
}
