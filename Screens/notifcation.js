import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ComplaintScreen from './complaintnot';
import PaymentScreen from './paymentnot';

const Tab = createMaterialTopTabNavigator();

const NotificationScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#3498db',
          height: 3,
        },
        tabBarStyle: {
          backgroundColor: '#edf0f1',
        },
      })}
    >
      <Tab.Screen name="complaint" component={ComplaintScreen} />
      <Tab.Screen name="payment" component={PaymentScreen} />
    </Tab.Navigator>
  );
};

export default NotificationScreen;
