import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image,Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useProductContext } from '../ProductContext';
import { useVendorContext } from '../VendorContext';
import { useContext } from 'react';
import { useQuantity } from '../Quantitycontext';
import ip from '../ipconfig';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StripeProvider,useStripe } from '@stripe/stripe-react-native';

const CheckoutScreen = ({navigation}) => {
  const { selectedProduct } = useProductContext();
  const { quantity } = useQuantity(); 
 // console.log(quantity);
  const { vendorId } = useVendorContext();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [vendorDetails, setVendorDetails] = useState(null);
  const stripe = useStripe();

  const fetchVendorDetails = async () => {
    try {
      const response = await axios.get(`http://${ip}:8000/get-vendor-info/${vendorId}`);
      setVendorDetails(response.data.vendor);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, []);

  const handlecheckout =async ()=>{
    let presentSheet;
    
    
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !address ||
      !city
    ) {
      alert('Please fill in all fields');
      return; 
    }
    if (
      !/^[a-zA-Z]+$/.test(firstName) ||
      !/^[a-zA-Z]+$/.test(lastName)
    ) {
      Alert.alert(
        'Validation Error',
        'First name and last name should only contain alphabetic characters.'
      );
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      Alert.alert(
        'Validation Error',
        'Phone number should only contain numbers.'
      );
      return;
    }
  
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email address');
      return;
    }

    const totalProductCost = selectedProduct.price * quantity;
    const totalDeliveryCost = selectedProduct.deliveryCost * quantity;
    const totalPayment = totalProductCost + totalDeliveryCost;

    if (paymentMethod === 'Credit/Debit Card') {
    try {
      
      // sending request
      const response = await fetch(`http://${ip}:8000/stripe/pay`, {
        method: 'POST',
        body: JSON.stringify({
          customerName: 'farhan',
          payment: totalPayment,
          
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Merchant Name',
      });
      presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
     
    } 
    
    catch (err) {
      console.error(err);
    }
   // console.log('presentSheet:', presentSheet);
   if (presentSheet && presentSheet.error && presentSheet.error.code === 'Canceled') {
      console.log('Payment sheet was canceled by the user');
      return; 
    }
    else{
      const vendorPaymentResponse =  axios.post(`http://${ip}:8000/updateVendorPayment`, {
        vendorId: vendorId,
        totalPayment: totalPayment,
    });
    }

  }
  

try{
  const token = await AsyncStorage.getItem('authToken');
  const decodedToken = jwt_decode(token);
  const userid = decodedToken.userId;

   
    const orderData = {
      userId: userid,
      userName: `${firstName} ${lastName}`,
      vendorId: vendorId,
      products: [
        {
          productId: selectedProduct._id,
          quantity: quantity,
        },
      ],
      orderStatus: ['Pending'],
      Productname:selectedProduct.name,
      Totalpayment: totalPayment,
      paymentMethod: paymentMethod,
      customerAddress: address,
      customerPhoneNumber: phoneNumber,
      customerCity: city,
    }
    const response = await axios.post(`http://${ip}:8000/create-order`, orderData);

    if (response.status === 200) {
      const orderId = response.data.orderId;
     
      alert('Order completed successfully');
      if (paymentMethod === 'Credit/Debit Card') {
        console.log(userid);
        const paymentResponse = await axios.post(`http://${ip}:8000/savePayment`, {
          orderId: orderId,
          vendorId: vendorId,
          customerId: userid,
          payment: totalPayment,
        });
     }
      
      navigation.navigate('Home'); 
    } else {
      alert('Failed to complete the order');
    }
  }catch (error) {
    console.error('Error completing the order:', error);
  }
 

  };

  const paymentMethods = [
    { name: 'Cash on Delivery', icon: 'money-off' },
    { name: 'Credit/Debit Card', icon: 'credit-card' },
  ];

  return (
   // <Fragment>
   
    <ScrollView style={styles.container}>
       <StripeProvider publishableKey="pk_test_51OHPYyKuji59BmbMAurR70H9MduB99tIiu4SBNVy2wsrhTtcnBreFBcRpTJuQlNBTx6xPrxolDrG7frKLNyK3W1d0057XlVtqO">
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: selectedProduct.images[0] }}
          style={styles.productImage}
        />
      </View>

      <View style={styles.productDetailsContainer}>
        <Text style={styles.productName}>{selectedProduct.name}</Text>
        <Text style={styles.productPrice}>Price: {selectedProduct.price}</Text>
        
        
        {vendorDetails && (
          <View style={styles.vendorDetails}>
            <Text style={styles.vendorText}>Vendor: {vendorDetails.name}</Text>
            <Text style={styles.vendorText}>City: {vendorDetails.city}</Text>
            <Text style={styles.vendorText}>Address: {vendorDetails.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.customerInfoContainer}>
        <Text style={styles.customerInfoHeader}>Customer Information</Text>
        <TextInput
          style={styles.inputField}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="City"
          value={city}
          onChangeText={(text) => setCity(text)}
        />
      </View>

      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.paymentMethodsHeader}>Payment Method</Text>
        {paymentMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paymentMethod,
              paymentMethod === method.name && styles.selectedPaymentMethod,
            ]}
            onPress={() => setPaymentMethod(method.name)}
          >
            <MaterialIcon
              name={method.icon}
              size={36}
              color={paymentMethod === method.name ? 'green' : 'black'}
            />
            <Text
              style={[
                styles.paymentMethodName,
                { color: paymentMethod === method.name ? 'green' : 'black' },
              ]}
            >
              {method.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.orderSummaryContainer}>
        <Text style={styles.orderSummaryHeader}>Order Summary</Text>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemName}>{selectedProduct.name}</Text>
          <Text style={styles.orderItemPrice}>Rs: {selectedProduct.price}</Text>
        </View>
        <View style={styles.totalPrice}>
          <Text style={styles.totalText}>Quantity</Text>
          <Text style={styles.totalAmount}>{quantity}</Text>
        </View>
        <View style={styles.totalPrice}>
          <Text style={styles.totalText}>Total Product Cost</Text>
          <Text style={styles.totalAmount}>Rs: {selectedProduct.price*quantity}</Text>
        </View>
        <View style={styles.totalPrice}>
          <Text style={styles.totalText}>Total Delivery Cost</Text>
          <Text style={styles.totalAmount}>Rs: {selectedProduct.deliveryCost*quantity}</Text>
        </View>
        <View style={styles.totalPrice}>
          <Text style={styles.totalText}>Total Payment</Text>
          <Text style={styles.totalAmount}>Rs: {selectedProduct.price*quantity + selectedProduct.deliveryCost*quantity}</Text>
        </View>
      </View>
      

      <TouchableOpacity style={styles.actionButton} onPress={handlecheckout}>
        <Text style={styles.actionButtonText}>
          {paymentMethod === 'Credit/Debit Card' ? 'Pay Now' : 'Complete Order'}
        </Text>
      </TouchableOpacity>
      </StripeProvider>
    </ScrollView>
   
    //</Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  productImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  productDetailsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  vendorDetails: {
    marginBottom: 10,
  },
  vendorText: {
    fontSize: 16,
    color: 'black',
  },
  customerInfoContainer: {
    padding: 16,
    marginBottom: 20,
  },
  customerInfoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  inputField: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 12,
  },
  paymentMethodsContainer: {
    padding: 16,
    marginBottom: 20,
  },
  paymentMethodsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    backgroundColor: 'lightgreen',
    borderRadius: 8,
  },
  paymentMethodName: {
    fontSize: 16,
    color: 'black',
    marginLeft: 12,
  },
  orderSummaryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  orderSummaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  orderItemPrice: {
    fontSize: 16,
    color: 'green',
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  actionButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    alignItems: 'center',
    margin: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
export default CheckoutScreen;