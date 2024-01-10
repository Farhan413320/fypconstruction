import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import Vendorprofile from './Vendorprofile';
import Vendororder from './Vendororder';
import Vendorchat from './Vendorchat';
import Vendorproposal from './Vendorproposal';

import ip from "../ipconfig";
import Vendorhomee from './vendorhome2';
//import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const Vendorhome = ({navigation}) => {
 //const navigation = useNavigation();

  // const handleLogout = async () => {
   
  //     try {
  //      await AsyncStorage.removeItem('authToken');
  //     navigation.navigate('Login');
  //     } catch (error) {
  //       console.error('Error clearing authToken:', error);
  //     }
  // };

  return (
    // <View style={styles.container}>
    
    // <View style={styles.header}>
    //   <Text style={styles.headerText}>Vendor Home</Text>
    //   <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
    //     <Text style={styles.logoutButtonText}>Logout</Text>
    //   </TouchableOpacity>
    // </View>
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'VendorHome') {
            iconName = 'home';
          } else if (route.name === 'Orders') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Chat') {
            iconName = 'chat';
          } else if (route.name === 'Proposals') {
            iconName = 'list';
          }

          return <MaterialIcons name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#FA7D54', 
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12, 
          fontWeight: 'bold', 
        },
        tabBarItemStyle: {
          paddingBottom: 6, 
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.2)',
        },
        headerShown: false,
      })}
    >
     <Tab.Screen name="VendorHome" component={Vendorhomee} /> 
      <Tab.Screen name="Orders" component={Vendororder} />
      <Tab.Screen name="Chat" component={Vendorchat} />
      <Tab.Screen name="Proposals" component={Vendorproposal} />
    </Tab.Navigator>
    // </View>
  );
};

export default Vendorhome;

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
  // Define your custom styles here
});
