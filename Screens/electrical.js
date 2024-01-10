import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ip from "../ipconfig";
import { useProductContext } from '../ProductContext';

const ElectricalScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setProduct } = useProductContext();
  const [filteredProducts, setFilteredProducts] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/getallproducts`);
        if (response.status === 200) {
          const filteredProducts = response.data.filter(
            (product) => product.category === 'Electricity'
          );
          console.log(filteredProducts);
          setProducts(filteredProducts);
          setFilteredProducts(filteredProducts); 
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProductPress = (product) => {
    setProduct(product);
    navigation.navigate('ProductD');
    
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    const lowercaseSearchText = text.toLowerCase();
    const filtered = products.filter((product) => product.name.toLowerCase().includes(lowercaseSearchText));
    setFilteredProducts(filtered);
  };

  const handleSearchPress = () => {
    
    setFilteredProducts(products);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Products</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <FontAwesomeIcon name="search" size={24} color="#888888" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {!loading && filteredProducts.length === 0 ? ( // Render filteredProducts instead of products
        <Text style={styles.noProductsText}>No products found in this category.</Text>
      ) : (
        <View style={styles.productGrid}>
          {filteredProducts.map((product, index) => (
            <TouchableOpacity
              key={product._id}
              style={styles.productContainer}
             
            >
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>Price: <Text style={styles.priceValue}>Rs: {product.price}</Text></Text>
              <TouchableOpacity style={styles.purchaseButton } onPress={() => handleProductPress(product)}>
                <Text style={styles.purchaseButtonText }>Purchase Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    alignItems: 'center',
    backgroundColor: '#fff',
    
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize:16,
    
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  noProductsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: 'black',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productContainer: {
    width: '48%', // Two products side by side with a small gap
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 160, // Adjust the height as needed
    marginBottom: 8,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008000',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  purchaseButton: {
    backgroundColor: '#008000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  purchaseButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});

export default ElectricalScreen;
