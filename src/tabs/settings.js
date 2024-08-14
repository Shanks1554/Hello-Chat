import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import * as Font from 'expo-font';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const Setting = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'zain': require('../../assets/fonts/Zain.ttf'), 
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem("MODE");
      if (storedMode) setCurrentTheme(storedMode);
    };
    fetchMode();
  }, []);

  const handleThemeChange = async () => {
    const newTheme = currentTheme === "LIGHT" ? "DARK" : "LIGHT";
    setCurrentTheme(newTheme);
    await AsyncStorage.setItem("MODE", newTheme);
    toggleTheme();
  };

  const handleSignOut = async () => {
    await AsyncStorage.clear(); 
    navigation.reset({
      index: 0,
      routes: [{ name: 'LogIn' }],
    });
  };

  

  

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme === 'LIGHT' ? 'white' : '#212121' },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity>
          <Image 
            style={[styles.title, { color: theme === 'LIGHT' ? 'purple' : 'lightgray' }]}
            source={require("../images/logo.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.themeChangeView}>
        <Text style={[styles.text, { color: currentTheme === 'LIGHT' ? 'black' : 'white' }]}>
          Change Mode
        </Text>
        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: currentTheme === 'LIGHT' ? 'black' : 'white' },
          ]}
          onPress={handleThemeChange}
        >
          <Text style={[styles.text, { color: currentTheme === 'LIGHT' ? 'white' : 'black' }]}>
            {currentTheme === 'LIGHT' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  themeChangeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    width: '100%', 
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  btn: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signOutBtn: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: 'red', 
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'zain', 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'zain',
  },
  editDetailsBtn: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: 'blue', 
  },
  text: {
    fontFamily: 'zain', 
  },
  header: {
    minWidth: "100%",
    justifyContent: "flex-end",
    borderWidth: 0,
    top: "0%",
    alignItems:"center",
    justifyContent:"center",
  },
  title: {
    width: width * 0.4,
    height: height * 0.2,
  },
});

export default Setting;