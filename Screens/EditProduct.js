import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import ip from '../ipconfig';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const EditProduct = ({ route, navigation }) => {
  const [productName, setProductName] = useState('');
  const [availability, setAvailability] = useState(true);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subcategoryTypes, setSubcategoryTypes] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState('');
  const [images, setImages] = useState(['', '', '']);
 // const navigation = useNavigation();
  const [subtype, setSubtype] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const productId = route.params.productId;

  const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Construction Material', value: 'Construction Material' },
    { label: 'Plumbing', value: 'Plumbing' },
    { label: 'Electricity', value: 'Electricity' },
    { label: 'Marbles & Tiles', value: 'Marbles & Tiles' },
    { label: 'Construction Tools', value: 'Construction Tools' },
  ];

  const subCategories = {
    'Construction Material': {
      'Brick': ['Brunt Clay Bricks', 'Sand Lime Bricks', 'Concrete Bricks', 'Flash Ash Clay Bricks'],
      'Bajri': ['Margalla crush bajri', 'Sargodha crush bajri A+ (2 sutar)', 'Sargodha crush bajri A (2 sutar)'],
      'Rait': ['Sand Chenab', 'Sand Ravi', 'Sand Ghazi'],
      'cement': ['Askari Cement', 'Maple Leaf Cement', 'Fauji Cement', 'Attock Cement Limited', 'D.G Khan Cement'],
    },
    'Plumbing': {
      'Pipes': ['PVC Pipes', 'Copper Pipes', 'PEX Pipes'],
      'Fittings': ['Elbows', 'Couplings', 'Tees', 'Adapters'],
      'Fixtures': ['Faucets', 'Sinks', 'Showers'],
    },
    'Electricity': {
      'Wiring': ['Romex Wiring', 'THHN Wiring', 'Coaxial Cable'],
      'Devices': ['Switches', 'Outlets', 'Dimmers'],
      'Lighting': ['LED Bulbs', 'Fluorescent Tubes', 'Ceiling Fixtures'],
    },
    'Marbles & Tiles': {
      'Marbles': ['Granite', 'Marble', 'Travertine'],
      'Tiles': ['Ceramic Tiles', 'Porcelain Tiles', 'Mosaic Tiles'],
    },
    'Construction Tools': {
      'Hand Tools': ['Hammer', 'Screwdriver', 'Pliers'],
      'Power Tools': ['Drill', 'Circular Saw', 'Jigsaw'],
    },
  };

  const handleCategoryChange = (itemValue) => {
    setCategory(itemValue);
    setSubCategory('');
    setSubtype('');
    if (subCategories[itemValue]) {
      setSubcategoryTypes(Object.keys(subCategories[itemValue]));
    } else {
      setSubcategoryTypes([]);
    }
  };

  const handleSubCategoryChange = (itemValue) => {
    setSubCategory(itemValue);
    setSubtype('');
  };



  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get(`http://${ip}:8000/findproduct/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          const productData = response.data.product;
          // console.log(productData);
          setProductName(productData.name);
          setAvailability(productData.availability);
          setPrice(productData.price.toString()); // Convert to string for TextInput
          setDescription(productData.description);
          setCategory(productData.category);
          setImages(productData.images);
  
          // If subcategory is available in productData, set it
          if (productData.subCategory) {
            setSubCategory(productData.subCategory);
            // If subtype is available in productData, set it
            if (productData.subtype) {
              setSubtype(productData.subtype);
            }
          }
  
          // Fetch subcategories and subtypes based on the selected category
          if (productData.category && subCategories[productData.category]) {
            setSubcategoryTypes(Object.keys(subCategories[productData.category]));
          }
  
          // If delivery cost and total quantity are available, set them
          if (productData.deliveryCost) {
            setDeliveryCost(productData.deliveryCost.toString());
          }
          if (productData.totalQuantity) {
            setTotalQuantity(productData.totalQuantity.toString());
          }
        } else {
          console.error('Failed to fetch product details');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchProductDetails();
  }, []);


  const handleImageSelection = async (index) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: false,
        mediaType: 'photo',
      });

      const updatedImages = [...images];
      updatedImages[index] = image.path;
      setImages(updatedImages);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Image Picker Error', error.message);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      // Create a FormData object and append updated data
      const updatedPrice = parseFloat(price);
      const updatedDeliveryCost = parseFloat(deliveryCost);
      const updatedTotalQuantity = parseFloat(totalQuantity);

      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('availability', availability);
      formData.append('price', updatedPrice);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('subtype', subtype);
      formData.append('deliveryCost', updatedDeliveryCost);
      formData.append('totalQuantity', updatedTotalQuantity);

      // Append new images or updated images
      images.forEach((image, index) => {
        if (image) {
          formData.append('images', {
            uri: image,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          });
        }
      });

      // Send the updated data to the server
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.put(`http://${ip}:8000/update-product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,   
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Product updated successfully', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Edit Product</Text>
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
          value={price.toString()}
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
            onValueChange={handleCategoryChange}
          >
            {categories.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
        {category && subCategories[category] && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Subcategory:</Text>
            <Picker
              selectedValue={subCategory}
              style={styles.categoryPicker}
              onValueChange={(itemValue) => handleSubCategoryChange(itemValue)}
            >
              <Picker.Item label="Select Subcategory" value="" />
              {subcategoryTypes.map((subcategory, index) => (
                <Picker.Item key={index} label={subcategory} value={subcategory} />
              ))}
            </Picker>
          </View>
        )}
        {subCategory && subCategories[category] && subCategories[category][subCategory] && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Subtype:</Text>
            <Picker
              selectedValue={subtype}
              style={styles.categoryPicker}
              onValueChange={(itemValue) => setSubtype(itemValue)}
            >
              <Picker.Item label={`Select ${subCategory}`} value="" />
              {subCategories[category][subCategory].map((subtype, subtypeIndex) => (
                <Picker.Item key={subtypeIndex} label={subtype} value={subtype} />
              ))}
            </Picker>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Delivery Cost"
          keyboardType="numeric"
          value={deliveryCost.toString()}
          onChangeText={(text) => setDeliveryCost(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Total Available Quantity"
          keyboardType="numeric"
          value={totalQuantity.toString()}
          onChangeText={(text) => setTotalQuantity(text)}
        />
        <Text style={styles.imageLabel}>Product Images (up to 3):</Text>
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
                <MaterialIcons name="add-a-photo" size={40} color="#000" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    marginRight: 10,
  },
  switchActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  switchInactive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  switchText: {
    color: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  categoryPicker: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  subCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
  },
  subCategoryLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  subCategoryPicker: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  subtypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  subtypeLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  subtypePicker: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  imageLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  updateButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditProduct;