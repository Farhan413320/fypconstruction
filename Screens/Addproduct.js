import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
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
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subcategoryTypes, setSubcategoryTypes] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState('');
  const [images, setImages] = useState(['', '', '']);
  const navigation = useNavigation();
  const [subtype, setSubtype] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');

  const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Construction Material', value: 'Construction Material' },
    { label: 'Plumbing', value: 'Plumbing' },
    { label: 'Electricity', value: 'Electricity' },
    { label: 'Marbles & Tiles', value: 'Marbles & Tiles' },
    { label: 'Construction Tools', value: 'Construction Tools' },
    { label: 'TMT Steel', value: 'TMT Steel' },
  ];

  const subCategories = {
    'Construction Material': {
      'Brick': ['Brunt Clay Bricks(awal)', 'Sand Lime Bricks', 'Concrete Bricks','Flash Ash Clay Bricks'],
      'Bajri': ['Margalla crush bajri', 'Sargodha crush bajri A+ (2 sutar)','Sargodha crush bajri A (2 sutar)'],
      'Rait': ['Sand Chenab', 'Sand Ravi','Sand Ghazi'],
      'cement': ['Askari Cement', 'Maple Leaf Cement', 'Fauji Cement','Attock Cement Limited','D.G Khan Cement'],
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
      'Hand Tools': ['Hammer', 'Screwdriver', 'Pliers','Earth Rammer'],
      'Power Tools': ['Drill', 'Circular Saw', 'Jigsaw'],
    },
    'TMT Steel': {
      'Structural Steel': ['I-Beams Girders', 'Angle bars', 'Channels', 'Plates'],
      'Reinforcement Steel (Rebar)': [
        'Deformed Bar (Grade 40)',
        'Deformed bar (Grade 60)',
       
      ],
    },
  };
  // const handleCategoryChange = (itemValue) => {
  //   setCategory(itemValue);
  //   setSubCategory('');
  //   setSubtype('');
  //   if (subCategories[itemValue]) {
  //     setSubcategoryTypes(Object.keys(subCategories[itemValue]));
  //   } else {
  //     setSubcategoryTypes([]);
  //   }
  // };

  // const handleSubCategoryChange = (itemValue) => {
  //   setSubCategory(itemValue);
  //   setSubtype('');
  // };

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

  const handleSubmit = async () => {
    if (
      !productName ||
      !price ||
      !category ||
      !subCategory ||
      !subtype ||
      !deliveryCost ||
      !totalQuantity
    ) {
      Alert.alert('Please Fill All Fields', 'All fields are required.');
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid price greater than 0.');
      return;
    }

    const numericDeliveryCost = parseFloat(deliveryCost);
    if (isNaN(numericDeliveryCost) || numericDeliveryCost < 0) {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid delivery cost that is 0 or greater.'
      );
      return;
    }

    const numericTotalQuantity = parseFloat(totalQuantity);
    if (isNaN(numericTotalQuantity) || numericTotalQuantity <= 0) {
      Alert.alert(
        'Invalid Input',
        'Please enter a valid total available quantity greater than 0.'
      );
      return;
    }
      try {
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

        const response = await axios.post(`http://${ip}:8000/imageupload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.imagePaths) {
          const uploadedImagePaths = response.data.imagePaths;

          const token = await AsyncStorage.getItem('authToken');
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.userId;
          const productData = {
            productName,
            availability,
            price: parseFloat(price),
            description,
            category,
            subCategory,
            subtype,
            deliveryCost: parseFloat(deliveryCost),
            totalQuantity: parseFloat(totalQuantity),
            images: uploadedImagePaths,
          };

          const submitResponse = await axios.post(`http://${ip}:8000/submit-product/${userId}`, productData);
console.log(productData);
          if (submitResponse.data.message) {
            setProductName('');
            setAvailability(true);
            setPrice('');
            setDescription('');
            setCategory('');
            setSubCategory('');
            setSubtype('');
            setDeliveryCost('');
            setImages(['', '', '']);
            navigation.navigate('ProductManagement', { refreshProductList: true });
            Alert.alert('Product Added', 'The product has been successfully added.');
          } else {
            Alert.alert('Product Submission Error', 'Failed to submit the product.');
          }
        } else {
          Alert.alert('Image Upload Error', 'Failed to upload images.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred.');
      }
    };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        value={deliveryCost}
        onChangeText={(text) => setDeliveryCost(text)}
      />
       <TextInput
        style={styles.input}
        placeholder="Total Available Quantity"
        keyboardType="numeric"
        value={totalQuantity}
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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
    fontSize: 16, // Adjust the font size to your preference
    color: '#333', 
  },
  categoryPicker: {
    flex: 1,
    height: 40, // Set the height to your preference
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  subCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10, // Added margin to align with category label
  },
  subCategoryLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  subCategoryPicker: {
    flex: 1,
    height: 40, // Increased height for better touch experience
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },

  subtypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20, // Added more margin to align with subcategory label
  },
  subtypeLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  subtypePicker: {
    flex: 1,
    height: 40, // Increased height for better touch experience
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
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddProductForm;
