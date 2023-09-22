import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ip from "../ipconfig";

const Vendorchat = ({ navigation }) => {
  const handleLogout = () => {
    // Implement logout functionality and clear authToken from AsyncStorage
    navigation.replace('Login'); // Navigate to the Login screen after logging out
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Vendor chat</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Vendorchat;
