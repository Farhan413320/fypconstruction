import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import ip from "../ipconfig";

const VendorScreen = ({navigation}) => {
  
  const [searchText, setSearchText] = useState('');

  const vendors = [
    { id: 1, storeName: 'Vendor A', productName: 'Product A', rating: 4.5 },
    { id: 2, storeName: 'Vendor B', productName: 'Product B', rating: 3.8 },
    { id: 3, storeName: 'Vendor C', productName: 'Product C', rating: 4.2 },
    { id: 4, storeName: 'Vendor d', productName: 'Product D', rating: 4.5 },
    { id: 5, storeName: 'Vendor E', productName: 'Product E', rating: 3.8 },
    { id: 6, storeName: 'Vendor F', productName: 'Product F', rating: 4.2 },
  ];

  const handleVendorPress = (vendor) => {
    console.log('Selected vendor:', vendor);
    // Handle navigation or other actions for the selected vendor
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    // Perform search/filtering based on the entered text
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
        <MaterialIcon name="search" size={24} color="#888888" style={styles.searchIcon} />
      </View>

      {vendors.map((vendor) => (
        <TouchableOpacity
          key={vendor.id}
          style={styles.vendorContainer}
          onPress={() => handleVendorPress(vendor)}
        >
          <Text style={styles.storeName}>{vendor.storeName}</Text>
          <Text style={styles.productName}>{vendor.productName}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('chatinbox')}>
              <FontAwesomeIcon name="comment-o" size={16} color="black" />
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.visitStoreText}>Visit Store</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ratingContainer}>
            <MaterialIcon name="star" size={16} color="#ffc107" style={styles.ratingIcon} />
            <Text style={styles.rating}>{vendor.rating} Stars</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  vendorContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555555',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 125, 84, 220)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 4,
    color: 'black',
  },
  visitStoreText: {
    color: 'black',
    
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingIcon: {
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#888888',
  },
});

export default VendorScreen;
