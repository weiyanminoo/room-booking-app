import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ScannerScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner Screen</Text>
      <Button
        title="Back to Room Listing"
        onPress={() => navigation.goBack()}
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

export default ScannerScreen;
