import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ip from '../ipconfig';
import ReviewPopup from './Review';
import { ReviewProductProvider, useReviewProduct } from '../reviewproduct';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  //const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const { updateReviewProductDetails } = useReviewProduct();


  const fetchUserOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://${ip}:8000/fetchallorders/${userId}`);
      const fetchedOrders = response.data.orders;
      setOrders(response.data.orders);

      fetchedOrders.forEach(async (order) => {
        await checkPendingReview(order._id);
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const checkPendingReview = async (orderId) => {
    try {
      const response = await axios.get(`http://${ip}:8000/checkReview/${orderId}`);
      const { hasReview } = response.data;

      if (!hasReview) {
        
        const orderDetails = await axios.get(`http://${ip}:8000/getOrderpersonDetails/${orderId}`);
        
        setShowReviewPopup(true);
        const orderDetailsresponse = orderDetails.data;
    //    console.log(orderDetailsresponse);
      //  setSelectedOrderDetails(orderDetailsresponse);
      updateReviewProductDetails({
        productName: orderDetails.data.Productname,
        totalPayment: orderDetails.data.Totalpayment,
      })
     // console.log( updateReviewProductDetails);
        setSelectedOrder({
          orderId,
          vendorId: orderDetails.data.vendorId,
          userId: orderDetails.data.userId,
          productName: orderDetails.data.Productname,
        });
      }
    } catch (error) {
      console.error('Error checking review:', error);
    }
  };

  const handleSubmitReview = async (rating, comment) => {
    try {
      console.log(selectedOrder.Productname);
      const { orderId, vendorId, userId ,productName} = selectedOrder;
      await axios.post(`http://${ip}:8000/saveReview`, {
        orderId,
        vendorId,
        customerId: userId,
        productName,
      rating,
      comment,
      });

      setShowReviewPopup(false);
      fetchUserOrders();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleOrderLongPress = (orderId) => {
    // Show a confirmation dialog for deleting the order
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteOrder(orderId),
          style: 'destructive',
        },
      ],
    );
  };

  const deleteOrder = async (orderId) => {
    try {
     
      await axios.delete(`http://${ip}:8000/delete-order/${orderId}`);

      
      fetchUserOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const calculateDeliveryDate = (createdAt) => {
    const creationDate = new Date(createdAt);
    creationDate.setDate(creationDate.getDate() + 3);
    return creationDate.toDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Orders</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.ordersList}
        refreshControl={<RefreshControl onRefresh={fetchUserOrders} refreshing={false} />}
      >
        {orders.map((order) => (
          <TouchableOpacity
            key={order._id}
            style={styles.orderItem}
            onLongPress={() => handleOrderLongPress(order._id)}
          >
            <View style={styles.orderDetailsContainer}>
              <Text style={styles.orderTitle}>Order Details</Text>
              {order.products.map((product, index) => (
                <Text key={index}>
                  {product.quantity} x {product.Productname}
                </Text>
              ))}
              <Text style={styles.productName}>Product Name: {order.Productname}</Text>
              <Text style={styles.totalAmount}>Total Amount: Rs: {order.Totalpayment}</Text>
              <Text style={styles.orderDate}>Order Date: {order.createdAt}</Text>
              <Text style={styles.expectedDeliveryDate}>Expected Delivery: {calculateDeliveryDate(order.createdAt)}</Text>
              <Text style={[styles.orderStatus, { color: order.orderStatus === 'Delivered' ? 'green' : 'red' }]}>
                Order Status: {order.orderStatus}
              </Text>
              <Text style={styles.paymentMethod}>Payment Method: {order.paymentMethod}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {showReviewPopup && (
        <ReviewPopup
       // orderDetails={selectedOrderDetails}
          onSubmit={(rating, comment) => handleSubmitReview(rating, comment)}
          onClose={() => setShowReviewPopup(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
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
    color: 'green',
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

export default CustomerOrdersScreen;
