import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, ActivityIndicator, Text, ScrollView, Alert } from 'react-native';
import { fromByteArray } from 'base64-js';

export default function DogImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [base64String, setBase64String] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(''); // Clear previous image
    setBase64String(''); // Clear previous base64

    try {
      const model = "gemini-2.0-flash-exp-image-generation"; // Double check this model name
      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];

      const generateContentConfig = {
        responseModalities: ["image", "text"],  // Check Gemini API docs for valid modalities
        responseMimeType: "text/plain", // Adjust if the Gemini API requires a specific image MIME type here

      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            generationConfig: generateContentConfig,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }

      const reader = response.body.getReader();
      let chunks = [];
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          chunks.push(value);
          console.log("Received chunk:", typeof value, value.length); // Log type and size
        }
        done = readerDone;
      }

      // Concatenate all chunks into a single Uint8Array
      let totalLength = 0;
      for (let chunk of chunks) {
        totalLength += chunk.length;
      }

      let allChunks = new Uint8Array(totalLength);
      let offset = 0;
      for (let chunk of chunks) {
          allChunks.set(chunk, offset);
          offset += chunk.length;
      }


      const base64Image = `data:image/png;base64,${fromByteArray(allChunks)}`; // Ensure correct MIME type for your image (png, jpeg, etc.)

      console.log("Generated Image URL (Base64):", base64Image.substring(0, 100) + "..."); // Log first 100 characters
      setImageUrl(base64Image);
      setBase64String(base64Image);

    } catch (error) {
      console.error("Error generating image:", error);
      Alert.alert("Error", `Image generation failed: ${error.message}`); // Display error to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Describe your dog:</Text>
      <TextInput
        placeholder="e.g. a smiling golden retriever"
        value={prompt}
        onChangeText={setPrompt}
        style={styles.input}
      />
      <Button title="Generate Image" onPress={generateImage} />
      {loading && <ActivityIndicator size="large" />}
      {imageUrl !== '' && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      {base64String !== '' && (
        <Text style={styles.base64Text}>
          {base64String}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10
  },
  image: { width: '100%', height: 300, marginTop: 20 },
  base64Text: {
    marginTop: 20,
    fontSize: 12,
    color: 'gray',
    wordWrap: 'break-word',
  },
});