import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

import Vendorprofile from './Vendorprofile';
import Vendororder from './Vendororder';
import Vendorchat from './Vendorchat';
import Vendorproposal from './Vendorproposal';
import ip from "../ipconfig";

const Tab = createBottomTabNavigator();

const Vendorhome = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'rgba(250,125,84,255)',
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        style: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={Vendorprofile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Vendororder}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" color={color} size={size} />
          ),
          tabBarLabel: 'Orders',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Vendorchat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" color={color} size={size} />
          ),
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Proposals"
        component={Vendorproposal}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list" color={color} size={size} />
          ),
          tabBarLabel: 'Proposals',
        }}
      />
    </Tab.Navigator>
  );
};

export default Vendorhome;

const styles = StyleSheet.create({
  // Define your custom styles here
});

