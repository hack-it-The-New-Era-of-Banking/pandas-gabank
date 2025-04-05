import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, ActivityIndicator, Text, ScrollView, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function DogImageGenerator() {
    const [prompt, setPrompt] = useState('a cute golden retriever puppy playing in a field of flowers');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState('');

    const generateImage = async () => {
        if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
            Alert.alert("Error", "Gemini API key is not configured. Set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.");
            return;
        }
        if (!prompt) {
            Alert.alert("Error", "Please enter a prompt.");
            return;
        }

        setLoading(true);
        setImageUrl('');
        setResponseText('');

        try {
            // Use the specified model for image generation
            const model = "gemini-2.0-flash-exp-image-generation";
            
            // Prepare the content request similar to the Python example
            const contents = [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ];

            // Configure the response to include both image and text
            const generationConfig = {
                responseModalities: ["image", "text"],
                responseMimeType: "text/plain",
            };

            // Make the API request
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents,
                        generationConfig,
                    }),
                }
            );

            if (!response.ok) {
                let errorText = "Unknown error";
                try {
                    const errorJson = await response.json();
                    console.error("API Error JSON:", errorJson);
                    errorText = errorJson.error?.message || JSON.stringify(errorJson);
                } catch (e) {
                    errorText = await response.text();
                    console.error("API Error Text:", errorText);
                }
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            }

            // Parse the response
            const data = await response.json();
            console.log("API Response received");

            // Process the response parts
            let foundImage = false;
            
            if (data.candidates && data.candidates.length > 0 && 
                data.candidates[0].content && data.candidates[0].content.parts) {
                
                const parts = data.candidates[0].content.parts;
                
                for (const part of parts) {
                    // Handle text parts
                    if (part.text) {
                        setResponseText(prev => prev + part.text);
                        console.log("Text response:", part.text);
                    }
                    
                    // Handle image data
                    if (part.inlineData) {
                        const inlineData = part.inlineData;
                        console.log("Found inline data with mime type:", inlineData.mimeType);
                        
                        // Convert binary data to a displayable image URL
                        const base64ImageData = inlineData.data;
                        const mimeType = inlineData.mimeType || 'image/png';
                        const base64Image = `data:${mimeType};base64,${base64ImageData}`;
                        
                        setImageUrl(base64Image);
                        foundImage = true;
                        
                        // Optionally save the image locally if needed
                        try {
                            const fileName = FileSystem.documentDirectory + 'gemini_generated_image.png';
                            await FileSystem.writeAsStringAsync(
                                fileName, 
                                base64ImageData, 
                                { encoding: FileSystem.EncodingType.Base64 }
                            );
                            console.log("Image saved locally at:", fileName);
                        } catch (saveError) {
                            console.error("Error saving image:", saveError);
                        }
                    }
                }
            }

            if (!foundImage) {
                // Handle cases where no image was found
                const errorReason = data.candidates?.[0]?.finishReason || "unknown";
                const errorMessage = `No image data found in response. Finish reason: ${errorReason}`;
                console.error(errorMessage, data);
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error("Error generating image:", error);
            Alert.alert("Error", `Image generation failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.label}>Describe the image you want:</Text>
                <TextInput
                    placeholder="e.g. a smiling golden retriever"
                    value={prompt}
                    onChangeText={setPrompt}
                    style={styles.input}
                    multiline={true}
                />
                <Button title="Generate Image" onPress={generateImage} disabled={loading} />
                
                {loading && <ActivityIndicator size="large" style={styles.loader} />}
                
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    !loading && <Text style={styles.placeholderText}>Image will appear here</Text>
                )}
                
                {responseText ? (
                    <View style={styles.textResponseContainer}>
                        <Text style={styles.responseTextLabel}>AI response:</Text>
                        <Text style={styles.responseText}>{responseText}</Text>
                    </View>
                ) : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  scrollContainer: {
      flexGrow: 1,
  },
  container: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: '#fff'
  },
  label: {
      fontSize: 16,
      marginBottom: 8,
      alignSelf: 'flex-start'
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '100%',
    minHeight: 80,
    paddingVertical: 8,
  },
  loader: {
      marginTop: 20,
  },
  image: {
      width: 300,
      height: 300,
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#ccc'
  },
  placeholderText: {
      marginTop: 20,
      color: 'gray',
      fontSize: 14,
  },
  textResponseContainer: {
      marginTop: 20,
      width: '100%',
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
  },
  responseTextLabel: {
      fontWeight: 'bold',
      marginBottom: 5,
  },
  responseText: {
      fontSize: 14,
  }
});