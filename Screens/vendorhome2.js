import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import ip from '../ipconfig';
import axios from 'axios';
import AddProductForm from './Addproduct';

// Import screens for the stack
import Product from './ProductManagement'; // You will need to create this component
import Contracts from './Contracts'; // You will need to create this component
import Vendorprofile from './Vendorprofile';




const Stack = createStackNavigator();

// Create a component for the stack navigator
const VendorHomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Vendorhome2" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vendorhome2" component={Vendorhomee} />
      <Stack.Screen name="ProductManagement" component={Product} />
      <Stack.Screen name="Contracts" component={Contracts} />
      <Stack.Screen name="Vendorprofile" component={Vendorprofile} />
      <Stack.Screen name="Addproduct" component={AddProductForm} />
      
    </Stack.Navigator>
  );
};

const Vendorhomee = ({ navigation }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Function to fetch user name based on user ID
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://${ip}:8000/vendorname/${userId}`);
        if (response.status === 200) {
          setUserName(response.data.userName);
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserName(); // Call the fetchUserName function when the component mounts
  }, []);

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = async () => {
    try {
      // Clear the authToken from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing authToken:', error);
    }
  };

  const navigateToSection = (sectionName) => {
    // For example, navigate to 'ProductManagement', 'ProfileManagement', 'CustomerSupport', etc.
    switch (sectionName) {
      case 'ProductManagement':
        navigation.navigate('ProductManagement');
        break;
      case 'ProfileManagement':
        navigation.navigate('ProfileManagement');
        break;
      case 'CustomerSupport':
        navigation.navigate('CustomerSupport');
        break;
      case 'Payments':
        navigation.navigate('Payments');
        break;
      case 'Contracts':
        navigation.navigate('Contracts');
        break;
      default:
        // Handle other cases or provide a default action
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vendor Home</Text>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.userInfoLeft} onPress={toggleLogout}>
            <Text style={styles.userName}>{userName}</Text>
            <MaterialIcons
              name={showLogout ? 'arrow-drop-up' : 'arrow-drop-down'}
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              // Handle notification button press here
              // You can navigate to a notifications screen or show a dropdown, etc.
            }}
          >
            <MaterialIcons name="notifications" color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      {showLogout && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={[styles.sectionButton, { backgroundColor: '#3498db' }]}
        onPress={() => navigateToSection('ProductManagement')}
      >
        <Text style={styles.buttonText}>Product Management</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionButton, { backgroundColor: '#e74c3c' }]}
        onPress={() => navigateToSection('Contracts')}
      >
        <Text style={styles.buttonText}>Contracts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionButton, { backgroundColor: '#27ae60' }]}
        onPress={() => navigateToSection('ProfileManagement')}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionButton, { backgroundColor: '#f39c12' }]}
        onPress={() => navigateToSection('VendorPayments')}
      >
        <Text style={styles.buttonText}>Payments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sectionButton, { backgroundColor: '#9b59b6' }]}
        onPress={() => navigateToSection('CustomerSupport')}
      >
        <Text style={styles.buttonText}>Customer Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'black',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align user info to the right
    flex: 1,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8, // Add margin to create space between user name and arrow
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutContainer: {
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingTop: 8,
  },
  logoutButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  notificationButton: {
    backgroundColor: 'transparent', // Transparent background for the notification button
    borderRadius: 50,
    padding: 10,
  },
  sectionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    elevation: 5,
    minHeight: 100, // Minimum height for the sections
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default VendorHomeStack;
