import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/splashPageStyles';

const LandingPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/gabanklogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LandingPage;
