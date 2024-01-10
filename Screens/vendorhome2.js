import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Image,ScrollView, RefreshControl} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import jwt_decode from 'jwt-decode';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'; 
import ip from '../ipconfig';
import axios from 'axios';
import AddProductForm from './Addproduct';

// Import screens for the stack
import Product from './ProductManagement'; // You will need to create this component
import Contracts from './Contracts'; // You will need to create this component
import Vendorprofile from './Vendorprofile';
import EditProduct from './EditProduct';
import Vendorchatbot from './Vendorsidechatbot';
import LoginScreen from './Login';



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
      <Stack.Screen name="EditProduct" component={EditProduct} />
      <Stack.Screen name="Vendorsidechatbot" component={Vendorchatbot} />
      <Stack.Screen name="Login" component={LoginScreen } />
     
     
      
    </Stack.Navigator>
  );
};

const Vendorhomee = ({navigation}) => {
  const [showLogout, setShowLogout] = useState(false);
  const [userName, setUserName] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://${ip}:8000/vendorname/${userId}`);
      if (response.status === 200) {
        setUserName(response.data.userName);
      }

      const productsResponse = await axios.get(`http://${ip}:8000/vendorproducts/count/${userId}`);
      if (productsResponse.status === 200) {
        setTotalProducts(productsResponse.data.count);
      }
      //console.log(userId);
      const payResponse = await axios.get(`http://${ip}:8000/vendorpay/count/${userId}`);
      if (payResponse.status === 200) {
        setTotalPayments(payResponse.data.count);
      }

      const ordersResponse = await axios.get(`http://${ip}:8000/vendororders/count/${userId}`);
      if (ordersResponse.status === 200) {
        setTotalOrders(ordersResponse.data.count);
      }

     

      setIsRefreshing(false);
    } catch (error) {
      console.error(error);
      setIsRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogoutPress =  async() => {
    
    try {
     await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing authToken:', error);
    }
  };

  return (
    <ScrollView
    style={styles.container}
    refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
    }
  >
      <View style={styles.header}>
        <Text style={styles.headerText}>Vendor Home</Text>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.userInfoLeft} onPress={toggleLogout}>
            <Text style={styles.userName}>{userName}</Text>
            <MaterialCommunityIcons
              name={showLogout ? 'chevron-up' : 'chevron-down'}
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
            <MaterialCommunityIcons name="bell" color="white" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      {showLogout && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

<View style={styles.vendorInfoBlock}>
       
        <View style={styles.vendorInfoText}>
          <Text style={styles.vendorName}>muhammad farhan</Text>
          <Text style={{ color: 'white' }}>Islamabad</Text>

          <View style={styles.ratingBlock}>
            <MaterialCommunityIcons name="star" color="white" size={20} />
            <Text style={styles.ratingText}>4.5</Text> 
          </View>
         
        </View>
      </View>


      <View style={styles.sectionsContainer}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('ProductManagement')}
        >
          <View style={styles.sectionCircle}>
            <MaterialCommunityIcons name="cart" color="black" size={40} />
          </View>
          <Text style={styles.sectionTitle}>Products</Text>
          <Text style={styles.sectionCount}>{totalProducts}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('Contracts')}
        >
          <View style={styles.sectionCircle}>
            <MaterialCommunityIcons name="file-document" color="black" size={40} />
          </View>
          <Text style={styles.sectionTitle}>Contracts</Text>
          <Text style={styles.sectionCount}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('Vendorprofile')}
        >
          <View style={styles.sectionCircle}>
            <MaterialCommunityIcons name="account" color="black" size={40} />
          </View>
          <Text style={styles.sectionTitle}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigateToSection('VendorPayments')}
        >
          <View style={styles.sectionCircle}>
            <MaterialCommunityIcons name="credit-card" color="black" size={40} />
          </View>
          <Text style={styles.sectionTitle}>Payments</Text>
          <Text style={styles.sectionCount}>{totalPayments}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('Vendorsidechatbot')}
        >
          <View style={styles.sectionCircle}>
            <MaterialCommunityIcons name="headphones" color="black" size={40} />
          </View>
          <Text style={styles.sectionTitle}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.section}
         
        >
          <View style={styles.sectionCircle}>
            <MaterialCommunityIcons name="clipboard-list" color="black" size={40} />
          </View>
          <Text style={styles.sectionTitle}>Total Orders</Text>
          <Text style={styles.sectionCount}>{totalOrders}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
    justifyContent: 'flex-end',
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    padding: 10,
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
  sectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  section: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 5,
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionCircle: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  vendorInfoBlock: {
    backgroundColor: 'black',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  vendorInfoText: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 4,
  },
  salesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default VendorHomeStack;
