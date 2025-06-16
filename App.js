import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import StoresListScreen from './components/ListingStores';
import StoreDetailScreen from './components/StoreDetailScreen';
import StoreRegister from './components/StoreRegister';
import ProductRegister from './components/ProductRegister';
import OrderDetails from './components/OrderDetails';
import OrdersListing from './components/OrdersListing.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="StoresList" component={StoresListScreen} />
        <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="StoreRegister" component={StoreRegister} />
        <Stack.Screen name="ProductRegister" component={ProductRegister} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="OrdersListing" component={OrdersListing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
