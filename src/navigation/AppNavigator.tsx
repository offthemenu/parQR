import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CarRegistrationScreen from '../screens/CarRegistrationScreen';

// Define navigation stack types
export type RootStackParamList = {
  Registration: undefined;
  Login: undefined;
  Dashboard: { userCode: string; qrCodeId: string };
  CarRegistration: { userId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CarRegistration" component={CarRegistrationScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
