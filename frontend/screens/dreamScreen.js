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
} from 'react-native';
import { fetchDreams, addDream } from '../backend/dreamController';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { signInUser } from '../backend/userController';
import Header from '../components/header';

const DreamScreen = () => {
  const [dreams, setDreams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [maxProgress, setMaxProgress] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
  

  const handleAddDream = async () => {
    if (!name || !maxProgress || !currentProgress) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      await addDream(name, parseInt(maxProgress), parseInt(currentProgress));
      setModalVisible(false);
      setName('');
      setMaxProgress('');
      setCurrentProgress('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
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
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add Dream</Text>
          </TouchableOpacity>
      <Text style={styles.listtitle}>Dream List</Text>
          <FlatList
            data={dreams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.dreamItem}>
                <Text style={styles.dreamName}>{item.name}</Text>
                <Text>Max Progress: {item.maxProgress}</Text>
                <Text>Current Progress: {item.currentProgress}</Text>
              </View>
            )}
          />


          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
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

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <View style={styles.modalButtons}>
                  <Button title="Add Dream" onPress={handleAddDream} />
                  <Button
                    title="Cancel"
                    color="red"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          

        </View>
      </KeyboardAvoidingView>
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
    paddingLeft: '12'
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
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DreamScreen;
