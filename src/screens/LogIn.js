import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Image } from "react-native";
import * as Font from 'expo-font';
import { firestore } from '../../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
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

    const handleLogIn = async () => {
        try {
            const q = query(
                collection(firestore, "users"),
                where("email", "==", email),
                where("password", "==", password)
            );

            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                Alert.alert("Login Error", "Invalid email or password.");
                return;
            }

            const userDoc = querySnapshot.docs[0].data();
            const userId = userDoc.userId;
            const name = userDoc.name;

            await AsyncStorage.setItem("NAME", name);
            await AsyncStorage.setItem("EMAIL", email);
            await AsyncStorage.setItem("USERID", userId);

            navigation.navigate("Main");
            
        } catch (err) {
            console.log(err);
            Alert.alert("Login Error", "An error occurred during login.");
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
            <Text style={styles.title}>Log In</Text>
            <TextInput
                placeholder="Enter E-mail:"
                style={[styles.input, { marginTop: 10 }]}
                value={email}
                onChangeText={txt => setEmail(txt)}
            />
            
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Enter Password:"
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={txt => setPassword(txt)}
                    secureTextEntry={!showPassword} 
                />
                <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                        name={showPassword ? "eye" : "eye-off"}
                        size={24}
                        color="gray"
                        style={styles.eyeIcon}
                    />
                </TouchableWithoutFeedback>
            </View>
           
            <TouchableOpacity style={styles.button} onPress={handleLogIn}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            
            <Text style={styles.onLogin} onPress={() => navigation.navigate("SignUp")}>
                Or Sign Up
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    title: {
        fontSize: 30,
        color: "#5089cb",
        alignSelf: "center",
        marginTop: 10,
        fontWeight: "600",
        fontFamily: "zain-bold"
    },
    input: {
        width: "90%",
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: "center",
        paddingLeft: 20,
        fontFamily: "zain-regular"
    },
    passwordContainer: {
        width: "90%",
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: "center",
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        position: 'relative'
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingLeft: 20,
        fontFamily: "zain-regular"
    },
    eyeIcon: {
        position: 'absolute',
        right: 10
    },
    button: {
        width: "90%",
        height: 50,
        borderRadius: 10,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        backgroundColor: "#5089CB"
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
    marginTop: 20,
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
