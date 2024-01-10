import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView,Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import ip from '../ipconfig';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const Product = ({ route}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  

  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`http://${ip}:8000/products/${userId}`);
      if (response.status === 200) {
        setProducts(response.data.products);
        console.log(response.data.products);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [route.params?.refreshProductList])
  );

  const handleDelete = (_id) => {
  //console.log(_id);
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this product?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => deleteProduct(_id),
      },
    ],
    { cancelable: false }
  );
};

const deleteProduct = async (_id) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const response = await axios.delete(`http://${ip}:8000/deleteproducts/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== _id));
     
      Alert.alert('Success', 'Product deleted successfully', [
        {
          text: 'OK',
          // onPress: () => {
          // },
        },
      ]);
    } else {
      console.error('Failed to delete product');
    }
  } catch (error) {
    console.error(error);
  }
};


const handleEdit = (_id) => {
  navigation.navigate('EditProduct', { productId:_id });

};


return (
  <View style={styles.container}>
    <Text style={styles.headerText}>Vendor Products</Text>
    {!loading && products.length === 0 ? (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.centeredMessageText}>You have not added any product yet.</Text>
      </View>
    ) : (
      <ScrollView style={{ flex: 1 }}>
        {products.map((product) => (
          <View key={product._id} style={styles.productItem}>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              {product.description && (
                <Text style={styles.productDescription}>{product.description}</Text>
              )}
                <Text style={styles.productDescription}>Price: {product.price}</Text>
              <Text style={styles.productDescription}>Delivery Cost: {product.deliveryCost}</Text>
              <Text style={styles.productDescription}>Category: {product.category}</Text>
              {product.subCategory && (
                <Text style={styles.productDescription}>Subcategory: {product.subCategory}</Text>
              )}
              {product.subtype && (
                <Text style={styles.productDescription}>Subtype: {product.subtype}</Text>
              )}
              <Text style={styles.productDescription}>Availability: {product.availability ? 'Yes' : 'No'}</Text>
              <Text style={styles.productDescription}>Total Quantity: {product.totalQuantity}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.productImage}
                />
              ))}
            </ScrollView>
            <View style={styles.productButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(product._id)}
              >
                <MaterialIcons name="edit" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(product._id)}
              >
                <MaterialIcons name="delete" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    )}
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => {
        navigation.navigate('Addproduct');
      }}
    >
      <Text style={styles.buttonText}>Add Product</Text>
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 16,
  backgroundColor: 'white',
},
headerText: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#000',
},
centeredMessageContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
centeredMessageText: {
  fontSize: 18,
  textAlign: 'center',
  color: '#000',
},
productItem: {
  backgroundColor: '#f7f7f7',
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
},
productDetails: {
  marginBottom: 12,
},
productName: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000',
},
productDescription: {
  fontSize: 18,
  color: '#555',
},
productImage: {
  width: 120,
  height: 120,
  marginHorizontal: 8,
  borderRadius: 8,
  resizeMode: 'cover',
},
productButtons: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
},
editButton: {
  backgroundColor: 'transparent',
  borderRadius: 12,
  padding: 12,
  marginRight: 12,
},
deleteButton: {
  backgroundColor: 'transparent',
  borderRadius: 12,
  padding: 12,
},
addButton: {
  position: 'absolute',
  top: 20,
  right: 20,
  backgroundColor: '#27ae60',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default Product;