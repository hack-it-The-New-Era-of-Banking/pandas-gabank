import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import SplashPage from './screens/splashPage';
import LandingPage from './screens/landingPage';
import SignUp from './screens/signUp';
import SignIn from './screens/signIn';
import GeminiTest from './screens/geminiTest';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashPage">
        <Stack.Screen name="SplashPage" component={SplashPage} options={{ headerShown: false }} />
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>

        <Stack.Screen name="GeminiTest" component={GeminiTest} /> *// This is the screen for testing the Gemini API
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
