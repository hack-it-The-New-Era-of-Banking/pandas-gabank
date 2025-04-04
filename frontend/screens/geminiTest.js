import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchGeminiResponse } from '../API/geminiTestService'; // Import the service function

const GeminiTest = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    if (!input.trim()) {
      alert('Please enter a prompt for the AI.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const aiResponse = await fetchGeminiResponse(input); 
      setResponse(aiResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemini AI Test</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a prompt for the AI"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Test AI" onPress={handleTest} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {response && <Text style={styles.response}>{response}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  response: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default GeminiTest;