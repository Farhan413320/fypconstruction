import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet, Alert } from 'react-native';
import { useContext } from 'react';
import { UserType } from '../UserContext';
import Checkbox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import ip from "../ipconfig";

const CreateProposal = ({navigation}) => {
  const { userId, setUserId} = useContext(UserType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);

  

  

  const categories = [
    'Construction Material Suppliers',
    'Sanitary Suppliers',
    'Electrical Suppliers',
    'Architects',
    'Construction Companies',
  ];

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };





  const handleSubmit = () => {
    if (!title || !description || selectedCategories.length === 0) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }
  
    const confirmationMessage =
      `Confirm Request\n` +
      `Title: ${title}\n` +
      `Description: ${description}\n` +
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
    const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userloggedId = decodedToken.userId;
      setUserId(userloggedId);
     // console.log(userloggedId);
   
    const proposalData = {
     // userId: userId,
      title,
      description,
      selectedCategories,
      attachments,
    };

    try {
      const response = await axios.post(`http://${ip}:8000/submit-proposal/${userId}`, proposalData);

      if (response.status === 200) {
        Alert.alert('Request Submitted', 'Your request has been successfully submitted.');
        navigation.navigate('proposalscreen');
        setTitle('');
        setDescription('');
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
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
  
      setSelectedFileName(result[0].name);
  
      const formData = new FormData();
      formData.append('file', {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      });
  
      // Send the file to the backend
      const response = await axios.post(`http://${ip}:8000/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        setAttachments([...attachments, response.data.filePath]);
      } else {
        console.error('Error uploading file:', response.data.message);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        console.log('Error selecting attachment:', error);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request for Proposal</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} onChangeText={setTitle} value={title} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          onChangeText={setDescription}
          value={description}
          multiline
        />

        <Text style={styles.label}>Vendor Categories</Text>
        {categories.map((category) => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color:'black',
  },
  formContainer: {
    width: '100%',
  },
 
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    color:'black',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentName: {
    flex: 1,
  },
  removeAttachmentText: {
    color: 'red',
  },
  selectedFileName: {
    marginLeft: 2,

    fontSize: 16,
    color: 'black',
  },
  attachButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  attachButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    width: 200,
    backgroundColor: 'rgba(250, 125, 84, 255)',
    borderRadius: 4,
    paddingVertical: 12,
    alignSelf: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',

  },
});

export default CreateProposal;
