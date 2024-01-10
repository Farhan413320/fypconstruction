import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import ip from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const PaymentScreen = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://${ip}:8000/get-paymentnot/${userId}`);
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error.message);
      }
    };

    fetchData();
  }, []); 

  return (
    <View style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item._id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <View style={styles.column}>
              <Text style={styles.paymentText}>{`Payment: ${item.payment} PKR`}</Text>
              <Text style={styles.orderText}>{`Order: ${item.orderId.Productname}`}</Text>
            </View>
            <Text style={styles.dateText}>{`Date: ${new Date(item.timeCreation).toLocaleString()}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db', 
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
   // marginLeft: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '90%', 
    alignSelf: 'center', 
  },
  column: {
    flexDirection: 'column',
  },
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  orderText: {
    fontSize: 16,
    color: 'black',
  },
  dateText: {
    fontSize: 14,
    color: '#7f8c8d', 
  },
});

export default PaymentScreen;
