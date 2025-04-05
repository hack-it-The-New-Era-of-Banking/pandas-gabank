import React from 'react';
import { View, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatBot() {
  return (
    <SafeAreaView style={styles.container}>
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
