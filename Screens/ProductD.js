import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { useProductContext } from '../ProductContext';
import axios from 'axios';
import ip from "../ipconfig";
import { useVendorContext } from '../VendorContext';
import { useQuantity } from '../Quantitycontext';
import { TouchableHighlight } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const ProductDet = ({ navigation }) => {
  const { selectedProduct } = useProductContext();
  const { quantity, setQuantity } = useQuantity();
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const [vendorDetails, setVendorDetails] = useState(null);
  const { setVendId } = useVendorContext();

  const fetchVendorDetails = async () => {
    try {
      const response = await axios.get(`http://${ip}:8000/get-vendor-info/${selectedProduct.vendorId}`);
      setVendorDetails(response.data.vendor);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, []);

  const productReviews = [
    { id: 1, rating: 5, name: 'Muhammad Farhan', review: 'Great product! Excellent quality.' },
    { id: 2, rating: 4, name: 'Asad Ur Rehman', review: 'Good product for the price.' },
    { id: 3, rating: 5, name: 'Haider Abbas', review: 'Impressive product, highly recommended.' },
    { id: 4, rating: 3, name: 'Muhammad Ahsan', review: 'Its an okay product.' },
    { id: 5, rating: 5, name: 'Sana Waseem', review: 'Amazing! I love it.' },
  ];

  const toggleSeeMore = () => {
    setReviewsToShow(reviewsToShow === 2 ? productReviews.length : 2);
  };

  const HandleCheckout = (_id) => {
    setVendId(_id);
    // console.log(_id);
    navigation.navigate('checkout');
  };

  const handleChatButtonClick = (_id) => {
    setVendId(_id);
    // console.log(_id);
    navigation.navigate('chatinbox');
  };

  // Image slider settings
  const renderImageSliderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageSliderItem} />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageSliderContainer}>
        <Carousel
          data={selectedProduct.images}
          renderItem={renderImageSliderItem}
          sliderWidth={350}
          itemWidth={350}
          loop
        />
      </View>

      <View style={styles.productDetailsContainer}>
        <Text style={styles.productName}>{selectedProduct.name}</Text>
        <Text style={styles.productDescription}>{selectedProduct.description}</Text>
        <Text style={styles.productPrice}>Price: {selectedProduct.price}</Text>
        <Text style={styles.productPrice}>delivery cost: {selectedProduct.deliveryCost}</Text>
        {vendorDetails && (
          <View style={styles.vendorDetailsContainer}>
            <Text style={styles.vendorText}>Vendor: {vendorDetails.name}</Text>
            <Text style={styles.vendorText}>City: {vendorDetails.city}</Text>
            <Text style={styles.vendorText}>Province: {vendorDetails.province}</Text>

            {/* Chat and Checkout buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleChatButtonClick(vendorDetails._id)}
              >
                <EntypoIcon name="chat" size={24} color="black" />
                <Text style={styles.actionButtonText}>Chat</Text>
              </TouchableOpacity>

             
            </View>
          </View>
        )}

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(prevQuantity => Math.max(1, prevQuantity - 1))}
            >
              <MaterialIcon name="remove" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(prevQuantity => prevQuantity + 1)}
            >
              <MaterialIcon name="add" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={() => HandleCheckout(vendorDetails._id)}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsHeader}>Product Reviews</Text>
        {productReviews.slice(0, reviewsToShow).map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewRating}>
              {Array.from({ length: review.rating }, (v, i) => (
                <MaterialIcon name="star" key={i} size={20} color="gold" />
              ))}
            </View>
            <Text style={styles.reviewName}>{review.name}</Text>
            <Text style={styles.reviewText}>{review.review}</Text>
          </View>
        ))}
        {productReviews.length > 2 && (
          <TouchableOpacity onPress={toggleSeeMore} style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>{reviewsToShow === 2 ? 'See More' : 'See Less'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageSliderContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageSliderItem: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  productDetailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  vendorDetailsContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  vendorText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    color: 'white',
  },
  productDescription: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 16,
    color: 'black',
    marginRight: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 16,
  },
  checkoutButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  reviewsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 16,
    color: 'black',
  },
  seeMoreButton: {
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default ProductDet;
