import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchDreams, addDreamWithImage } from '../backend/dreamController';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { signInUser } from '../backend/userController';
import Header from '../components/header';
import * as FileSystem from 'expo-file-system';

// Maximum allowed image size in bytes (1MB)
const MAX_IMAGE_SIZE = 1000000;
import BottomNavBar from '../components/bottomNavBar';

const DreamScreen = () => {
  const [dreams, setDreams] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [maxProgress, setMaxProgress] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Image generation states
  const [imageUrl, setImageUrl] = useState('');
  const [imageSize, setImageSize] = useState(0);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('Dream'); // initial active tab
  useEffect(() => {
    const auth = getAuth();
    const email = auth.currentUser?.email;
  
    if (!email) return;
  
    const fetchDreams = () => {
      const dreamCollection = collection(firestore, 'Dream');
      const q = query(dreamCollection, where('email', '==', email));
  
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const dreamsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDreams(dreamsData);
      });
  
      return unsubscribeSnapshot;
    };
  
    const unsubscribe = fetchDreams();
    return () => unsubscribe();
  }, []);

  // Calculate size of base64 image in bytes
  const calculateImageSize = (base64String) => {
    // Remove the data URL prefix if present
    let base64Data = base64String;
    if (base64String.includes('base64,')) {
      base64Data = base64String.split('base64,')[1];
    }
    
    // Each base64 character represents 6 bits, so 4 characters are 3 bytes
    // Length times 0.75 gives us the size in bytes
    const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    return sizeInBytes;
  };

  // Image generation and dream creation
  const generateImage = async () => {
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
        setErrorMessage("Gemini API key is not configured. Set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.");
        return;
    }
    if (!name) {
        setErrorMessage("Please enter a goal name first.");
        return;
    }

    setLoading(true);
    setImageUrl('');
    setResponseText('');
    setErrorMessage('');
    setImageSize(0);

    try {
        // Create an enhanced prompt based on the goal name
        const enhancedPrompt = `Create a vibrant, inspiring visualization of "${name}". Make it motivational and visually appealing.`;
        
        // Use the specified model for image generation
        const model = "gemini-2.0-flash-exp-image-generation";
        
        // Prepare the content request
        const contents = [
            {
                role: "user",
                parts: [{ text: enhancedPrompt }],
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
                    
                    // Calculate image size in bytes
                    const size = calculateImageSize(base64ImageData);
                    setImageSize(size);
                    console.log(`Image size: ${size} bytes`);
                    
                    // Check if image is within size limit
                    if (size > MAX_IMAGE_SIZE) {
                        // We'll still display the image but show a warning
                        Alert.alert(
                            "Image Size Warning", 
                            `The generated image is ${(size/1024/1024).toFixed(2)}MB which exceeds the 1MB limit. You'll need to generate a new image that's smaller.`
                        );
                    }
                    
                    setImageUrl(base64Image);
                    foundImage = true;
                }
            }
        }

        if (!foundImage) {
            throw new Error(`No image data found in response.`);
        }

    } catch (error) {
        console.error("Error generating image:", error);
        setErrorMessage(`Image generation failed: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  const handleAddDreamWithImage = async () => {
    if (!name || !maxProgress || !currentProgress || !imageUrl) {
      setErrorMessage('All fields including image are required.');
      return;
    }
    
    // Check image size again before saving
    if (imageSize > MAX_IMAGE_SIZE) {
      setErrorMessage(`Image is too large (${(imageSize/1024/1024).toFixed(2)}MB). Please generate a smaller image (max 1MB).`);
      return;
    }

    try {
      await addDreamWithImage(
        name, 
        parseInt(maxProgress), 
        parseInt(currentProgress), 
        imageUrl,
        name // Using the goal name as the prompt text
      );
      
      setImageModalVisible(false);
      setName('');
      setMaxProgress('');
      setCurrentProgress('');
      setImageUrl('');
      setResponseText('');
      setErrorMessage('');
      setImageSize(0);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Function to render each dream item
  const renderDreamItem = ({ item }) => {
    return (
      <View style={styles.dreamItem}>
        <Text style={styles.dreamName}>{item.name}</Text>
        <Text>Max Progress: {item.maxProgress}</Text>
        <Text>Current Progress: {item.currentProgress}</Text>
        
        {/* Show image if this dream has one */}
        {item.imageUrl && (
          <View style={styles.dreamImageContainer}>
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.dreamImage}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Header />
        <View style={styles.container}>
          <Text style={styles.titletext}>Create Dream</Text>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setImageModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add Dream</Text>
          </TouchableOpacity>
          
          <Text style={styles.listtitle}>Dream List</Text>
          <FlatList
            data={dreams}
            keyExtractor={(item) => item.id}
            renderItem={renderDreamItem}
          />

          {/* Dream With Image Modal */}
          <Modal
            visible={imageModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setImageModalVisible(false)}
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add a New Dream</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Goal Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Max Progress"
                  value={maxProgress}
                  onChangeText={setMaxProgress}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Progress"
                  value={currentProgress}
                  onChangeText={setCurrentProgress}
                  keyboardType="numeric"
                />

                <Text style={styles.sectionTitle}>Generate an Image for Your Dream</Text>
                <Text style={styles.helpText}>
                  Click the button below to generate an inspirational image based on your goal name.
                  Images must be under 1MB in size.
                </Text>
                
                <Button 
                  title="Generate Image" 
                  onPress={generateImage} 
                  disabled={loading || !name} 
                />
                
                {loading && (
                  <ActivityIndicator size="large" style={styles.loader} />
                )}
                
                {imageUrl ? (
                  <View>
                    <View style={styles.generatedImageContainer}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.generatedImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[
                      styles.imageSizeText, 
                      imageSize > MAX_IMAGE_SIZE ? styles.imageSizeError : null
                    ]}>
                      Image size: {(imageSize / 1024).toFixed(2)} KB
                      {imageSize > MAX_IMAGE_SIZE ? ' (exceeds 1MB limit)' : ''}
                    </Text>
                  </View>
                ) : null}
                
                {responseText ? (
                  <View style={styles.textResponseContainer}>
                    <Text style={styles.responseTextLabel}>AI response:</Text>
                    <Text style={styles.responseText}>{responseText}</Text>
                  </View>
                ) : null}

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <View style={styles.modalButtons}>
                  <Button 
                    title="Add Dream" 
                    onPress={handleAddDreamWithImage} 
                    disabled={!imageUrl || imageSize > MAX_IMAGE_SIZE} 
                  />
                  <Button
                    title="Cancel"
                    color="red"
                    onPress={() => {
                      setImageModalVisible(false);
                      setImageUrl('');
                      setResponseText('');
                      setImageSize(0);
                    }}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </KeyboardAvoidingView>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    marginHorizontal: 30, 
    paddingVertical: 20 
  },
  addButton: {
    backgroundColor: '#13B5B5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dreamItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titletext: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#403D3D',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 20,
    marginTop: 5,
    textAlign: 'center',
    color: '#403D3D',
  },
  listtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'left',
    color: '#403D3D',
    paddingLeft: 12
  },
  dreamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  loader: {
    marginTop: 16,
    marginBottom: 16,
  },
  generatedImageContainer: {
    width: '100%',
    height: 200,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  generatedImage: {
    width: '100%',
    height: '100%',
  },
  imageSizeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right',
  },
  imageSizeError: {
    color: 'red',
    fontWeight: 'bold',
  },
  textResponseContainer: {
    marginTop: 16,
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
  },
  dreamImageContainer: {
    marginTop: 10,
    width: '100%',
    height: 150,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  dreamImage: {
    width: '100%',
    height: '100%',
  }
});

export default DreamScreen;
