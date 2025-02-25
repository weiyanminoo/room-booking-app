import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RoomListingScreen from '../screens/RoomListingScreen';
import ScannerScreen from '../screens/ScannerScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoomListing">
        <Stack.Screen
          name="RoomListing"
          component={RoomListingScreen}
          options={{ title: 'Room Listing' }}
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ title: 'Scanner' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
