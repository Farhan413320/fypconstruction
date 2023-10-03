import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

import Vendorprofile from './Vendorprofile';
import Vendororder from './Vendororder';
import Vendorchat from './Vendorchat';
import Vendorproposal from './Vendorproposal';

import ip from "../ipconfig";
import Vendorhomee from './vendorhome2';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const Vendorhome = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
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
        tabBarActiveTintColor: '#FA7D54', // Custom active color
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12, // Custom font size
          fontWeight: 'bold', // Custom font weight
        },
        tabBarItemStyle: {
          paddingBottom: 6, // Custom padding for tab items
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Custom background color
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.2)',
        },
      })}
    >
      <Tab.Screen name="VendorHome" component={Vendorhomee} />
      <Tab.Screen name="Orders" component={Vendororder} />
      <Tab.Screen name="Chat" component={Vendorchat} />
      <Tab.Screen name="Proposals" component={Vendorproposal} />
    </Tab.Navigator>
  );
};

export default Vendorhome;

const styles = StyleSheet.create({
  // Define your custom styles here
});
