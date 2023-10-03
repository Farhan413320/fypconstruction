import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import ip from '../ipconfig';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [availability, setAvailability] = useState(true);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // State for category selection
  const [images, setImages] = useState(['', '', '']); // Initialize with 3 empty strings
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const navigation = useNavigation();


  const handleImageSelection = async (index) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true, // Enable cropping
        multiple: false, // Allow selecting only one image
        mediaType: 'photo', // Set this to 'photo' or 'video' based on your requirements
      });

      // Image selected or captured successfully, update the images state
      const updatedImages = [...images];
      updatedImages[index] = image.path;
      setImages(updatedImages);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        // Handle errors, excluding cancellation
        Alert.alert('Image Picker Error', error.message);
      }
    }
  };

  const handleSubmit = () => {
    // Check if any of the required fields are empty
    if (!productName || !price || !category) {
      Alert.alert('Please Fill All Fields', 'All fields are required.');
    } else {
      // Show the confirmation message using Alert
      Alert.alert(
        'Confirm Submission',
        'Are you sure you want to add this product?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: handleConfirm,
          },
        ],
        { cancelable: false }
      );
    }
  };
  
  // ...
  
  const handleConfirm = async () => {
    try {
      // Upload images first
      const formData = new FormData();
      images.forEach((image, index) => {
        if (image) {
          formData.append('images', {
            uri: image,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          });
        }
      });
  
      // Upload images to the server
      const response = await axios.post(`http://${ip}:8000/imageupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.imagePaths) {
        const uploadedImagePaths = response.data.imagePaths;
  
        // Send product data with image paths to the server for submission
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        const productData = {
          productName,
          availability,
          price,
          description,
          category,
          images: uploadedImagePaths, // Update with server paths
        };
  
        const submitResponse = await axios.post(`http://${ip}:8000/submit-product/${userId}`, productData);
  
        if (submitResponse.data.message) {
          // Clear the form fields
          setProductName('');
          setAvailability(true);
          setPrice('');
          setDescription('');
          setCategory('');
          setImages(['', '', '']);
          navigation.navigate('ProductManagement', { refreshProductList: true });
          Alert.alert('Product Added', 'The product has been successfully added.');
        } else {
          // Handle product submission error
          Alert.alert('Product Submission Error', 'Failed to submit the product.');
        }
      } else {
        // Handle image upload error
        Alert.alert('Image Upload Error', 'Failed to upload images.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred.');
    }
  };
  
  const handleCancel = () => {
    // Clear the form and hide the confirmation message
    setProductName('');
    setAvailability(true);
    setPrice('');
    setDescription('');
    setCategory('');
    setImages(['', '', '']); // Clear image URLs
    setConfirmationVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Availability:</Text>
        <TouchableOpacity
          style={availability ? styles.switchActive : styles.switchInactive}
          onPress={() => setAvailability(!availability)}
        >
          <Text style={styles.switchText}>{availability ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={(text) => setPrice(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <Picker
          selectedValue={category}
          style={styles.categoryPicker}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Contruction Material" value="Construction Material" />
          <Picker.Item label="Plumbing" value="Plumbing" />
          <Picker.Item label="Electricity" value="Electricity" />
        </Picker>
      </View>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imagePicker}
            onPress={() => handleImageSelection(index)}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <MaterialIcons name="add-a-photo" size={48} color="#555" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      {confirmationVisible && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>Confirm submission?</Text>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.confirmButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 18, // Increased font size
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16, // Increased font size
    marginRight: 12, // Increased margin
  },
  switchActive: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 6, // Increased padding
    paddingHorizontal: 12, // Increased padding
  },
  switchInactive: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 6, // Increased padding
    paddingHorizontal: 12, // Increased padding
  },
  switchText: {
    color: 'white',
    fontSize: 18, // Increased font size
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16, // Increased font size
    marginRight: 12, // Increased margin
  },
  categoryPicker: {
    flex: 1,
    fontSize: 18, // Increased font size
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imagePicker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 16,
    height: 120, // Increased height
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16, // Increased font size
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 20, // Increased padding
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  confirmationText: {
    fontSize: 16, // Increased font size
    marginRight: 16,
  },
  confirmButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 12, // Increased padding
    paddingHorizontal: 20, // Increased padding
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 12, // Increased padding
    paddingHorizontal: 20, // Increased padding
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16, // Increased font size
    fontWeight: 'bold',
  },
});

export default AddProductForm;
