import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet, Alert,ScrollView, Button } from 'react-native';
import { useContext } from 'react';
import { UserType } from '../UserContext';
import Checkbox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import DatePicker from 'react-native-date-picker';
import ip from "../ipconfig";

const CreateProposal = ({navigation}) => {
  const { userId, setUserId} = useContext(UserType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subcategoryTypes, setSubcategoryTypes] = useState([]);
  const [subtype, setSubtype] = useState('');

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

  const categoriess = [
    'Construction Material Suppliers',
    'Sanitary Suppliers',
    'Electrical Suppliers',
    'Architects',
    'Construction Companies',
    'Marbles & Tiles',
    'Construction Tools',
  ];

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };





  const handleSubmit = () => {
    if (!title || !description ||!address || selectedCategories.length === 0) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (startDate < currentDate) {
      Alert.alert('Invalid Start Date', 'Start date should be today or later.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Invalid End Date', 'End date should be later than the start date.');
      return;
    }

    const budgetNumber = parseFloat(budget);
    if (isNaN(budgetNumber) || budgetNumber <= 0) {
      Alert.alert('Invalid Budget', 'Budget range should be a valid number greater than 0.');
      return;
    }
  
    const confirmationMessage =
      `Confirm Request\n` +
      `Title: ${title}\n` +
      `Description: ${description}\n` +
      `Budget Range: ${budget}\n` +
      `Address: ${address}\n` +
      `File: ${selectedFileName || 'No file attached'}\n` +
      `Categories: ${selectedCategories.join(', ')}`;
  
    // Show confirmation dialog
    Alert.alert(
      '',
      confirmationMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', style: 'default' },
        { text: 'Submit', style: 'destructive', onPress: submitRequest },
      ],
      { style: 'default', title: 'Confirm Request' }
    );
  };
  
  

  const submitRequest = async () => {
    let uploadedImagePaths;
    if (attachments.length > 0) {
    const formData = new FormData();
    attachments.forEach((image, index) => {
      if (image) {
        formData.append('images', {
          uri: image,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      }
    });

    // Upload images to the server
    const responseimage = await axios.post(`http://${ip}:8000/imageupload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    //console.log(responseimage);

    if (responseimage.data.imagePaths) {
      uploadedImagePaths = responseimage.data.imagePaths;
     // console.log(uploadedImagePaths);

    }
  }

    const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userloggedId = decodedToken.userId;
      setUserId(userloggedId);
      console.log(userloggedId);
   
    const proposalData = {
     // userId: userId,
      title,
      description,
      budget,
      address,
      selectedCategories,
      category,
      subCategory,
      subtype,
      attachments:uploadedImagePaths,
      startDate, 
      endDate,
    };
    console.log(userId);

    try {
      const response = await axios.post(`http://${ip}:8000/submit-proposal/${userId}`, proposalData);

      if (response.status === 200) {
        Alert.alert('Request Submitted', 'Your request has been successfully submitted.');
        navigation.navigate('proposalscreen');
        setTitle('');
        setDescription('');
        setBudget('');
        setAddress('');
        setSelectedCategories([]);
        setAttachments([]);
        setSelectedFileName(null);
      } else {
        Alert.alert('Error', response.data.message || 'An error occurred while submitting the request.');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      Alert.alert('Error', 'An error occurred while submitting the request.');
    }
  };

  const handleFile = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true, 
        multiple: false, 
        mediaType: 'photo', 
      });

      
      setAttachments([...attachments, image.path]);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
       
        Alert.alert('Image Picker Error', error.message);
      }
    }
  };
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Request for Proposal</Text>

        <View style={styles.formContainer}>
        
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} onChangeText={setTitle} value={title} />

          <View style={styles.categoryContainer}>
  <Text style={styles.categoryLabel}>Product Category:</Text>
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
    <Text style={styles.categoryLabel}>Product Subcategory:</Text>
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
    <Text style={styles.categoryLabel}>Product Subtype:</Text>
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
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            onChangeText={setDescription}
            value={description}
            multiline
          />

          
          <Text style={styles.label}>Budget Range</Text>
          <TextInput
            style={styles.input}
            onChangeText={setBudget}
            value={budget}
            placeholder="Enter Budget Range"
          />

         
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setOpenStartDate(true)}>
              <Text style={styles.datePickerText}>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openStartDate}
              date={startDate}
              onConfirm={(date) => {
                setOpenStartDate(false);
                setStartDate(date);
              }}
              onCancel={() => setOpenStartDate(false)}
            />
          </View>

          
          <View style={styles.dateContainer}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setOpenEndDate(true)}>
              <Text style={styles.datePickerText}>{endDate.toDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openEndDate}
              date={endDate}
              onConfirm={(date) => {
                setOpenEndDate(false);
                setEndDate(date);
              }}
              onCancel={() => setOpenEndDate(false)}
            />
          </View>

         
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            onChangeText={setAddress}
            value={address}
            placeholder="Enter Address"
          />

          
          <Text style={styles.label}>Vendor Categories</Text>
          {categoriess.map((category) => (
            <View style={styles.checkboxContainer} key={category}>
              <Checkbox
                value={selectedCategories.includes(category)}
                onValueChange={() => handleCategoryToggle(category)}
              />
              <Text style={styles.checkboxLabel}>{category}</Text>
            </View>
          ))}

          
          <TouchableOpacity style={styles.attachButton} onPress={handleFile}>
            <Text style={styles.attachButtonText}>Attach File</Text>
          </TouchableOpacity>
          {selectedFileName && (
            <Text style={styles.selectedFileName}>Selected File: {selectedFileName}</Text>
          )}

          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateContainer: {
    marginBottom: 16,
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
  datePicker: {
    backgroundColor: '#F2F2F2',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: 'black',
    fontSize:17,
  },
  attachButton: {
    backgroundColor: '#3498DB',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  attachButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedFileName: {
    marginLeft: 2,
    fontSize: 16,
    color: '#333333',
  },
  submitButton: {
    width: 200,
    backgroundColor: '#FF6347',
    borderRadius: 4,
    paddingVertical: 12,
    alignSelf: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default CreateProposal;
