import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RoomListingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Listing Screen</Text>
      <Button 
        title="Go to Scanner"
        onPress={() => navigation.navigate('Scanner')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default RoomListingScreen;
