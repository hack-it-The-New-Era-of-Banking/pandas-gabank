import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import BottomNavBar from '../components/bottomNavBar'; 
import Header from '../components/header';

export default function ChatBot() {
    const [activeTab, setActiveTab] = useState('Save'); // initial active tab
  return (
    <SafeAreaView style={styles.container}>
    <Header />
      <WebView
        source={{
          uri: 'https://app.chaindesk.ai/agents/cm93my4zd00e374s9gq1ltenu/iframe',
        }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={styles.webview}
      />
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 25 : 0,
  },
  webview: {
    flex: 1,
  },
});
