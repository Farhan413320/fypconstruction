import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StarRating from 'react-native-star-rating';
import { useReviewProduct } from '../reviewproduct';

const ReviewPopup = ({ visible, onClose, onSubmit }) => {
  const { reviewProductDetails } = useReviewProduct();
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (text) => {
    // Limit the number of characters to 100
    if (text.length <= 100) {
      setComment(text);
    }
  };

  const handleCancel = () => {
    setRating(1);
    setComment('');
    onClose();
  };

  const handleSubmit = () => {
    // Check if the comment is empty
    if (comment.trim() === '') {
      Alert.alert('Error', 'Please fill in the comment field before submitting.');
    } else {
      onSubmit(rating, comment);
      setRating(1);
      setComment('');
      onClose();
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.popupContainer}>
        <View style={styles.popupContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.popupTitle}>Review for Order</Text>
          <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderDetailText}>Product Name: {reviewProductDetails.productName}</Text>
            <Text style={styles.orderDetailText}>Total Amount: Rs: {reviewProductDetails.totalPayment}</Text>
          </View>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            selectedStar={(rating) => handleRatingChange(rating)}
            starSize={30}
            fullStarColor="#FFD700"
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Write your review here..."
            multiline
            value={comment}
            onChangeText={(text) => handleCommentChange(text)}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  orderDetailsContainer: {
    marginBottom: 20,
  },
  orderDetailText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 100,
    padding: 10,
    marginBottom: 20,
    fontSize: 17,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ReviewPopup;
