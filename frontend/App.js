
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';


import SplashPage from './screens/splashPage';
import LandingPage from './screens/landingPage';
import SignUp from './screens/signUp';
import SignIn from './screens/signIn';
import HomePage from './screens/homePage';
import GeminiTest from './screens/geminiTest';
import PinSetup from './screens/pinSetup';
import ConfirmPinSetup from './screens/confirmPinSetup';
import DreamScreen from './screens/dreamScreen';
import AddCard from './screens/addCard';
import ManageCard from './screens/manageCard';
import ReceiveMoney from './screens/receiveMoney';
import BudgetMoney from './screens/budgetMoney';
import SaveMoney from './screens/saveMoney';
import ChatBot from './screens/chatBot';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashPage">
        <Stack.Screen name="SplashPage" component={SplashPage} options={{ headerShown: false }} />
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="PinSetup" component={PinSetup} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmPinSetup" component={ConfirmPinSetup} options={{ headerShown: false }} />
        <Stack.Screen name="GeminiTest" component={GeminiTest} /> 
        <Stack.Screen name="DreamScreen" component={DreamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddCard" component={AddCard} options={{ headerShown: false }} />
        <Stack.Screen name="ManageCard" component={ManageCard} options={{ headerShown: false }} />
        <Stack.Screen name="ReceiveMoney" component={ReceiveMoney} options={{ headerShown: false }} />
        <Stack.Screen name="BudgetMoney" component={BudgetMoney} options={{ headerShown: false }} />
        <Stack.Screen name="SaveMoney" component={SaveMoney} options={{ headerShown: false }} />
        <Stack.Screen name="ChatBot" component={ChatBot} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
