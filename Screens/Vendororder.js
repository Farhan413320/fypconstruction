import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import ip from '../ipconfig';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Vendororder = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  const fetchUserOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://${ip}:8000/fetchallvendororders/${userId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const changeOrderStatus = async (orderId, newStatus) => {
    try {

      await axios.put(`http://${ip}:8000/update-order-status/${orderId}`, { newStatus });
      fetchUserOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const calculateDeliveryDate = (createdAt) => {
    const creationDate = new Date(createdAt);
    creationDate.setDate(creationDate.getDate() + 3); // Adding 3 days for expected delivery
    return creationDate.toDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Orders</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.ordersList}
        refreshControl={<RefreshControl onRefresh={fetchUserOrders} refreshing={false} />}
      >
        {orders.map((order) => (
          <TouchableOpacity key={order._id} style={styles.orderItem}>
            <View style={styles.orderDetailsContainer}>
              <Text style={styles.orderTitle}>Order Details</Text>
              {order.products.map((product, index) => (
                <Text key={index}>
                  {product.quantity}
                </Text>
              ))}
              <Text style={styles.productName}>Product Name: {order.Productname}</Text>
              <Text style={styles.productName}>Total Amount: Rs: {order.Totalpayment}</Text>
              <Text style={styles.productName}>Client name: {order.userName}</Text>
               <Text style={styles.productName}>Client Address: {order.customerAddress}</Text>
              <Text style={styles.productName}>Phone number: {order.customerPhoneNumber}</Text> 
              <Text style={styles.orderDate}>Order Date: {order.createdAt}</Text>
              <Text style={styles.expectedDeliveryDate}>
                Expected Delivery: {calculateDeliveryDate(order.createdAt)}
              </Text>
              <Text
                style={[
                  styles.orderStatus,
                  { color: (order.orderStatus === 'Delivered') ? 'green' : 'red' },
                ]}
              >
                Order Status: {order.orderStatus}
              </Text>
              {order.orderStatus.includes('Pending') && (
                <View>
                  <Text>Change Order Status:</Text>
                  <Picker
                    selectedValue={order.orderStatus[0]}
                    onValueChange={(newStatus) => changeOrderStatus(order._id, newStatus)}
                  >
                    <Picker.Item label="Approved" value="Approved" />
                    <Picker.Item label="Declined" value="Declined" />
                    <Picker.Item label="Delivered" value="Delivered" />
                  </Picker>
                </View>
              )}
              <Text style={styles.paymentMethod}>Payment Method: {order.paymentMethod}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  ordersList: {
    padding: 16,
  },
  orderItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: 'transparent',
    backgroundColor: 'lightgray',
  },
  orderDetailsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 16,
  },
  orderDate: {
    fontSize: 16,
  },
  expectedDeliveryDate: {
    fontSize: 16,
  },
  orderStatus: {
    fontSize: 16,
  },
  paymentMethod: {
    fontSize: 16,
  },
});

export default Vendororder;
