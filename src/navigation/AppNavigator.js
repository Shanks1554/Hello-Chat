import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from '../context/ThemeContext'; 
import Splash from "../screens/Splash";
import SignUp from "../screens/SignUp";
import LogIn from "../screens/LogIn";
import Main from "../screens/Main";
import Chat from "../screens/Chat";
import Setting from '../tabs/settings';
import Feedback from '../screens/Feedback';
import EditDetails from '../tabs/EditDetails';

const Stack = createStackNavigator();


export default function AppNavigator() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LogIn"
            component={LogIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Settings'
            component={Setting}
            options={{headerShown:false}}
          />
          <Stack.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />
          <Stack.Screen name="Edit Details" component={EditDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
