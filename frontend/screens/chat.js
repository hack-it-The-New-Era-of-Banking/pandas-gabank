import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function Chat() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.EXPO_PUBLIC_CHAT_GEMINI_API_KEY; // Store API key securely (use environment variables ideally)

  const handleGenerateContent = async () => {
    setLoading(true); // Show loading indicator
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: "Explain how AI works in a few words" }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      //console.log("Full response:", response);  // Log the entire response to check the structure

      // Access the correct part of the response
      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        console.log("Generated Content:", generatedText); // Log the generated content
        setContent(generatedText); // Update content with the generated text
      } else {
        console.log("No generated content found in the response");
        setContent("No content generated, please try again.");
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setContent('Error generating content, please try again.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Button to trigger the API call */}
        <TouchableOpacity onPress={handleGenerateContent} style={{ backgroundColor: '#6FB513', padding: 15, borderRadius: 5 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Generate Content</Text>
        </TouchableOpacity>

        {/* Show loading indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#6FB513" style={{ marginTop: 20 }} />
        ) : (
          <Text style={{ marginTop: 20, fontSize: 16, textAlign: 'center' }}>{content}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
