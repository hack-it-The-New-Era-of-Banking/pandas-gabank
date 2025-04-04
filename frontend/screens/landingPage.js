import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/landingPageStyles';

const LandingPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/gabanklogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.signupbtn} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginbtn} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LandingPage;
