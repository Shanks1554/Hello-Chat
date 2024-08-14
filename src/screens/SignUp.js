import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import * as Font from 'expo-font';
import * as ImagePicker from "expo-image-picker";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { firestore } from '../../firebaseConfig';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  }, []);

  const checkEmailExists = async (email) => {
    const q = query(collection(firestore, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const RegisterUser = async () => {
    if (await checkEmailExists(email)) {
      Alert.alert("Error", "Email already exists. Please use a different email.");
      return;
    }

    const userId = uuid.v4();
    const userRef = doc(collection(firestore, "users"), userId);

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image, userId);
    }

    const userData = {
      name,
      email,
      password,
      mobile,
      userId,
      imageUri: imageUrl
    };

    try {
      await setDoc(userRef, userData);
      navigation.navigate("LogIn");
    } catch (err) {
      console.warn(err);
    }
  };

  const uploadImage = async (uri, userId) => {
    if (!uri) {
      console.error("No image URI to upload");
      return null;
    }

    try {
      setUploading(true);
      const { uri: fileUri } = await FileSystem.getInfoAsync(uri);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network Request Failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", fileUri, true);
        xhr.send(null);
      });

      const filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
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
    if (name === "") isValid = false;
    if (email === "") isValid = false;
    if (mobile === "") isValid = false;
    if (password === "") isValid = false;
    if (confirmPassword === "") isValid = false;
    if (confirmPassword !== password) isValid = false;
    if (!validatePassword(password)) isValid = false;
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image 
            style={styles.logo}
            source={require("../images/logo.png")}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Sign Up</Text>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePickerText}>Select Profile Picture</Text>
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        placeholder="Enter Name:"
        style={[styles.input,{marginVertical:"1%"}]}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Enter E-mail:"
        style={[styles.input,{marginVertical:"1%"}]}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Enter Mobile:"
        style={[styles.input,{marginVertical:"1%"}]}
        keyboardType="number-pad"
        value={mobile}
        onChangeText={setMobile}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Password:"
          style={[styles.input, { paddingRight: 50 }]} 
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Confirm Password:"
          style={[styles.input, { paddingRight: 50 }]} 
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (validate()) {
            RegisterUser();
          } else {
            Alert.alert("Please Enter Correct Data");
          }
        }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.onLogin} onPress={() => navigation.navigate("LogIn")}>Or Log In</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  title: {
    fontSize: 30,
    color: "#5089cb",
    alignSelf: "center",
    fontWeight: "600",
    fontFamily: 'zain-bold',
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D1D1D1",
    paddingLeft: 20,
    fontFamily: 'zain-regular',
    paddingRight: 40,
  },
  inputContainer: {
    position: 'relative',
    marginVertical: "1%",
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, 
    top: '50%',
    transform: [{ translateY: -12 }], 
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5089CB",
    marginVertical: "2%",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: 'zain-bold',
  },
  onLogin: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "black", 
    fontFamily: 'zain-bold',
  },
  imagePicker: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  imagePickerText: {
    color: '#888',
    fontFamily: 'zain-regular',
  },
  header: {
    minWidth: "100%",
    justifyContent: "flex-end",
    borderWidth: 0,
    top: "0%",
    alignItems:"center",
    justifyContent:"center",
  },
  logo: {
    width: width * 0.4,
    height: height * 0.2,
  }
});
