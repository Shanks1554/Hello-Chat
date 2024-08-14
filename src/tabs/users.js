import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import * as Font from 'expo-font';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export default function Users() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

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
    getCurrentUserId();
    getUsers();
  }, []);

  const getCurrentUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      if (userId) {
        setCurrentUserId(userId);
      }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };

  const getUsers = async () => {
    try {
      const email = await AsyncStorage.getItem('EMAIL');

      const usersRef = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersRef);

      const usersList = querySnapshot.docs
        .map(doc => doc.data())
        .filter(user => user.email !== email); 

       
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        { backgroundColor: theme === 'LIGHT' ? 'white' : '#333' },{borderColor: theme === 'LIGHT' ?  '#333':'white' }
      ]}
      onPress={() => {
        navigation.navigate('Chat', { data: item });
      }}
    >
      <Image
        source={item.imageUri ? { uri: item.imageUri } : require('../images/user.png')}
        style={styles.userIcon}
      />
      <Text style={[styles.userName, { color: theme === 'LIGHT' ? 'black' : 'white', fontFamily: 'zain-bold' }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'LIGHT' ? '#fff' : '#333' }]}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image 
            style={[styles.title, { color: theme === 'LIGHT' ? 'purple' : 'lightgray' }]}
            source={require("../images/logo.png")}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.userId}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    marginHorizontal:3,
    borderRadius:50,
    borderBottomColor: 'black',
    justifyContent: 'space-between',
    marginVertical:"0.5%"
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 30,
    fontFamily: 'zain-bold',
    flex: 1,
    marginLeft:"25%"
  },
  header: {
    minWidth: '100%',
    justifyContent: 'flex-end',
    borderWidth: 0,
    top: '0%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  title: {
    width: width * 0.4,
    height: height * 0.2,
  },
});
