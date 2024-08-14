import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useTheme } from '../context/ThemeContext';
import * as Font from 'expo-font';

export default function Feedback({ navigation }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'zain-regular': require('../../assets/fonts/Zain.ttf'),
        'zain-bold': require('../../assets/fonts/Zain-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const handleSubmit = async () => {
    if (!name || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'feedback'), {
        name,
        message,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Your feedback has been submitted.');
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'There was an error submitting your feedback.');
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === 'LIGHT' ? 'white' : '#212121' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme === 'LIGHT' ? 'black' : 'white' },
        ]}
      >
        Feedback
      </Text>
      <TextInput
        style={[
          styles.input,
          theme === 'LIGHT' ? styles.lightInput : styles.darkInput,
        ]}
        placeholder="Name"
        placeholderTextColor={theme === 'LIGHT' ? 'gray' : 'lightgray'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          styles.messageInput,
          theme === 'LIGHT' ? styles.lightInput : styles.darkInput,
        ]}
        placeholder="Your Feedback"
        placeholderTextColor={theme === 'LIGHT' ? 'gray' : 'lightgray'}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'zain-bold',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  lightInput: {
    backgroundColor: 'white',
    color: 'black',
  },
  darkInput: {
    backgroundColor: '#333',
    color: 'white',
  },
  messageInput: {
    height: 100,
  },
  submitBtn: {
    backgroundColor: '#5089CB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'zain-bold',
  }
});
