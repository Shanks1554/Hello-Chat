import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function EditDetails() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'zain-bold': require('../../assets/fonts/Zain-Bold.ttf'),
          'zain-regular': require('../../assets/fonts/Zain.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();

    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('USERID');
      setUserId(userId);
      const docRef = doc(firestore, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name);
        setEmail(userData.email);
        setImage(userData.imageUri);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async () => {
    if (password !== confirmPassword) {
      Alert.alert("New passwords do not match");
      return;
    }

    if (currentPassword) {
      const userDocRef = doc(firestore, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      if (userData.password !== currentPassword) {
        Alert.alert("Current password is incorrect");
        return;
      }
    }

    const userRef = doc(firestore, "users", userId);
    const updatedData = {
      name,
      email,
    };

    if (image) {
      updatedData.imageUri = await uploadImage(image, userId);
    } else {
      updatedData.imageUri = (await getDoc(userRef)).data().imageUri;
    }

    if (password) {
      updatedData.password = password;
    }

    try {
      await updateDoc(userRef, updatedData);
      Alert.alert("Profile updated successfully");
    } catch (err) {
      console.warn(err);
    }
  };

  const uploadImage = async (uri, userId) => {
    if (!uri) return null;

    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.split('/').pop();
      const ref = firebase.storage().ref().child(`profile_images/${userId}/${filename}`);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      return null;
    }
  };

  const validate = () => {
    let isValid = true;
    if (name === "" || email === "" || (password && password !== confirmPassword)) {
      isValid = false;
    }
    if (password && !validatePassword(password)) {
      isValid = false;
    }
    if (currentPassword === "") {
      isValid = false;
    }
    return isValid;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme === 'LIGHT' ? '#fff' : '#333' }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} >
        <View style={styles.header}>
          <TouchableOpacity>
            <Image 
              style={styles.logo}
              source={require("../images/logo.png")}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { color: theme === 'LIGHT' ? '#000' : '#fff' }]}>Edit Profile</Text>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <Text style={[styles.imagePickerText, { color: theme === 'LIGHT' ? '#888' : '#aaa' }]}>Select Profile Picture</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme === 'LIGHT' ? '#000' : '#fff' }]}>Name:</Text>
          <TextInput
            placeholder="Enter Your Name"
            style={[styles.input, { borderColor: theme === 'LIGHT' ? '#ccc' : '#555' },{color: theme === 'LIGHT' ? '#000' : '#fff'}]}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme === 'LIGHT' ? '#000' : '#fff' }]}>Email:</Text>
          <TextInput
            placeholder="Enter Your Email"
            style={[styles.input, { borderColor: theme === 'LIGHT' ? '#ccc' : '#555' },{color: theme === 'LIGHT' ? '#000' : '#fff'}]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={false}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme === 'LIGHT' ? '#000' : '#fff' }]}>Current Password:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Current Password"
              style={[styles.input, { borderColor: theme === 'LIGHT' ? '#ccc' : '#555', paddingRight: width * 0.12 },{color: theme === 'LIGHT' ? '#000' : '#fff'}]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color={theme === 'LIGHT' ? 'gray' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme === 'LIGHT' ? '#000' : '#fff' }]}>New Password:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter New Password"
              style={[styles.input, { borderColor: theme === 'LIGHT' ? '#ccc' : '#555', paddingRight: width * 0.12 },{color: theme === 'LIGHT' ? '#000' : '#fff'}]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color={theme === 'LIGHT' ? 'gray' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme === 'LIGHT' ? '#000' : '#fff' }]}>Confirm Password:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm New Password"
              style={[styles.input, { borderColor: theme === 'LIGHT' ? '#ccc' : '#555', paddingRight: width * 0.12 },{color: theme === 'LIGHT' ? '#000' : '#fff'}]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color={theme === 'LIGHT' ? 'gray' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.button]}
          onPress={() => {
            if (validate()) {
              updateProfile();
            } else {
              Alert.alert("Please fill all fields correctly.");
            }
          }}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width:"100%"
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom:100,
    
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.2,
  },
  title: {
    fontSize: 24,
    fontFamily: 'zain-bold',
    marginBottom: 20,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    color: 'gray',
    fontFamily: 'zain-regular',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'zain-regular',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: 'zain-regular',
    
  },
  inputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor:"#5089CB"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'zain-bold',
  },
});
