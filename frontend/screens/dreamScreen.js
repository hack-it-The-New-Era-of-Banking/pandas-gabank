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
  Alert,ScrollView,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { fetchDreams, addDreamWithImage } from '../backend/dreamController';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { signInUser } from '../backend/userController';
import Header from '../components/header';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

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
  const [compressing, setCompressing] = useState(false);

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

  // Compress image to be under MAX_IMAGE_SIZE (1MB)
  const compressImage = async (imageUri) => {
    setCompressing(true);
    try {
      // Extract base64 data from the data URL
      const base64Data = imageUri.split('base64,')[1];
      
      // Save to temporary file
      const tempUri = FileSystem.documentDirectory + 'temp_image.jpg';
      await FileSystem.writeAsStringAsync(
        tempUri,
        base64Data,
        { encoding: FileSystem.EncodingType.Base64 }
      );

      // Start with moderate compression
      let quality = 0.5;
      let result = await manipulateAsync(
        tempUri,
        [{ resize: { width: 512 } }],
        { compress: quality, format: SaveFormat.JPEG }
      );

      // Read the compressed image
      let compressedBase64 = await FileSystem.readAsStringAsync(
        result.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      
      // If still too large, compress more aggressively
      if (calculateImageSize(compressedBase64) > MAX_IMAGE_SIZE) {
        quality = 0.3;
        result = await manipulateAsync(
          tempUri,
          [{ resize: { width: 512 } }],
          { compress: quality, format: SaveFormat.JPEG }
        );
        compressedBase64 = await FileSystem.readAsStringAsync(
          result.uri,
          { encoding: FileSystem.EncodingType.Base64 }
        );
      }

      // Clean up
      await FileSystem.deleteAsync(tempUri, { idempotent: true });
      
      const compressedImageUri = `data:image/jpeg;base64,${compressedBase64}`;
      setCompressing(false);
      return compressedImageUri;
    } catch (error) {
      console.error("Error compressing image:", error);
      setCompressing(false);
      throw error;
    }
  };

  const handleAddDreamWithImage = async () => {
    if (!name || !maxProgress || !currentProgress || !imageUrl) {
      setErrorMessage('All fields including image are required.');
      return;
    }

    try {
      setLoading(true);
      
      // Always compress the image before saving
      const compressedImageUrl = await compressImage(imageUrl);
      
      await addDreamWithImage(
        name, 
        parseInt(maxProgress), 
        parseInt(currentProgress), 
        compressedImageUrl,
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
    } finally {
      setLoading(false);
    }
  };

  // Function to render each dream item
  const renderDreamItem = ({ item }) => {
    return (
      <View style={styles.dreamItem}>
        <Text style={styles.dreamName}>{item.name}</Text>
        
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Progress: ₱ {item.currentProgress.toLocaleString()} / ₱ {item.maxProgress.toLocaleString()}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round((item.currentProgress / item.maxProgress) * 100)}%
            </Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${Math.min((item.currentProgress / item.maxProgress) * 100, 100)}%`,
                  backgroundColor: (item.currentProgress / item.maxProgress) >= 1 ? '#4CAF50' : '#6FB513'
                }
              ]} 
            />
          </View>
        </View>

        {/* Dream Image */}
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.container}>
          
            <Text style={styles.titletext}>Create Dream</Text>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setImageModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add Dream</Text>
            </TouchableOpacity>
            
            <Text style={styles.listtitle}>Dream List</Text>
            <FlatList
              data={[...dreams].reverse()}
              keyExtractor={(item) => item.id}
              renderItem={renderDreamItem}
              contentContainerStyle={styles.dreamList}
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
                    placeholder="Needed Amount"
                    value={maxProgress}
                    onChangeText={setMaxProgress}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Current Amount"
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
                    onPress={() => generateImage()} 
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
                      <Text style={[styles.imageSizeText, imageSize > MAX_IMAGE_SIZE ? styles.imageSizeError : null]}>
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

                  {compressing && (
                    <View style={styles.compressionContainer}>
                      <ActivityIndicator size="small" color="#13B5B5" />
                      <Text style={styles.compressionText}>Optimizing image...</Text>
                    </View>
                  )}
                </View>
              </KeyboardAvoidingView>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
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
    backgroundColor: '#6FB513',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
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
    color: '#333',
    marginBottom: 12
  },
  progressSection: {
    marginBottom: 12
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  progressText: {
    fontSize: 14,
    color: '#666'
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6FB513'
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4
  },
  dreamList: {
    padding: 16
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
  },
  responseTextLabel: {
    fontWeight: 'bold',
  },
  responseText: {
    fontSize: 14,
  },
  dreamImageContainer: {
    marginTop: 12,
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  },
  dreamImage: {
    width: '100%',
    height: '100%'
  },
  compressionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  compressionText: {
    marginLeft: 8,
    color: '#13B5B5',
    fontSize: 14,
  },
});

export default DreamScreen;
