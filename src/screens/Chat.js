import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { collection, addDoc, query, orderBy, onSnapshot, getDocs, writeBatch } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import * as Font from "expo-font";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning:']); 


export default function Chat({ route }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userId, setUserId] = useState(null);
  const { data } = route.params;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteChat = async () => {
    if (!userId || !data.userId) return;
  
    const chatId = userId < data.userId ? `${userId}-${data.userId}` : `${data.userId}-${userId}`;
    const messagesRef = collection(firestore, "chats", chatId, "messages");
  
    try {
      const querySnapshot = await getDocs(messagesRef);
  
      const batch = writeBatch(firestore);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
  
      setMessages([]);
  
      
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "zain-bold": require("../../assets/fonts/Zain-Bold.ttf"),
          "zain-regular": require("../../assets/fonts/Zain.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("USERID");
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    loadFonts();
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const chatId = userId < data.userId ? `${userId}-${data.userId}` : `${data.userId}-${userId}`;
      const messagesQuery = query(collection(firestore, "chats", chatId, "messages"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          user: {
            _id: doc.data().sendBy,
            name: doc.data().userName || "Unknown",
            avatar: doc.data().userAvatar || 'default-avatar-uri',
          },
        }));

        setMessages(messagesList);
      }, (error) => {
        console.error("Error fetching messages:", error);
      });

      return () => unsubscribe();
    }
  }, [userId, data.userId]);

  const onSend = useCallback(async (messages = []) => {
    if (!userId) return;

    const chatId = userId < data.userId ? `${userId}-${data.userId}` : `${data.userId}-${userId}`;
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: userId,
      sendTo: data.userId,
      createdAt: new Date(),
      userName: "Your Name",
      userAvatar: data.imageUri || 'default-avatar-uri',
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, myMsg));

    try {
      await addDoc(collection(firestore, "chats", chatId, "messages"), myMsg);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }, [userId, data.userId]);

  const renderAvatar = useCallback((props = {}) => (
    <View style={styles.avatarContainer}>
      <Image source={{ uri: props.currentMessage.user.avatar }} style={styles.avatar} />
    </View>
  ), []);

  const renderBubble = useCallback((props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: theme === "LIGHT" ? "#5089CB" : "#333" },
        left: { backgroundColor: theme === "LIGHT" ? "#5089CB" : "#555" },
      }}
      textStyle={{
        right: { color: theme === "LIGHT" ? "black" : "white", fontFamily: "zain-regular", fontSize: 15 },
        left: { color: theme === "LIGHT" ? "black" : "white", fontFamily: "zain-regular", fontSize: 15 },
      }}
    />
  ), [theme]);

  const chatStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "LIGHT" ? "white" : "black",
    },
    header: {
      height: 80,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      backgroundColor: theme === 'LIGHT' ? 'white' : '#333',
      paddingHorizontal: 10,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    headerText: {
      fontSize: 40,
      fontFamily: 'zain-bold',
      color: theme === 'LIGHT' ? 'black' : 'white',
      flex: 1,
    },
    backButton: {
      padding: 10,
    },
    deleteButton: {
      padding: 10,
    },
    chatContainer: {
      flex: 1,
      justifyContent: 'flex-end', 
    },
  });

  if (!fontsLoaded || !userId) {
    return null; 
  }

  return (
    <SafeAreaView style={chatStyles.container}>
      <View style={chatStyles.header}>
        <TouchableOpacity onPress={handleBackPress} style={chatStyles.backButton}>
          <AntDesign name="arrowleft" size={30} color={theme === 'LIGHT' ? 'black' : 'white'} />
        </TouchableOpacity>
        <View style={chatStyles.profileContainer}>
          <Image source={{ uri: data.imageUri || 'default-avatar-uri' }} style={chatStyles.profileImage} />
          <Text style={chatStyles.headerText}>
            {data.name}
          </Text>
        </View>
        <TouchableOpacity onPress={handleDeleteChat} style={chatStyles.deleteButton}>
          <Ionicons name="trash-bin" size={30} color={theme === 'LIGHT' ? 'black' : 'white'} />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={chatStyles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
              _id: userId,
              name: "Your Name",
              avatar: data.imageUri, 
            }}
            renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            placeholder="Type a message..."
            textInputStyle={{
              color: "black", 
              fontSize: 20,
              textAlignVertical: 'center',
              lineHeight: 40, 
              paddingBottom: 10,
            }}
            listViewStyle={{ backgroundColor: theme === "LIGHT" ? "white" : "#212121" }}
            timeTextStyle={{ color: theme === "LIGHT" ? "black" : "white" }}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    padding: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
