import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import ip from '../ipconfig';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

const Vendorprofile = ({ navigation }) => {
  const [vendorInfo, setVendorInfo] = useState({});
  const [vendorImage, setVendorImage] = useState(null);

  useEffect(() => {
    fetchVendorInfo();
  }, []);

  const fetchVendorInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      const response = await axios.get(`http://${ip}:8000/get-vendor-info/${userId}`);

      if (response.status === 200) {
        setVendorInfo(response.data.vendor);
        setVendorImage(response.data.vendor.profilePicture);
      } else {
        console.error('Failed to fetch vendor information');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImagePicker = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (!response.didCancel) {
          setVendorImage(response.uri);
          // Additional logic to update the vendor profile image on the backend
          // You may want to send the image to your backend and update the database
          // Add your backend API route here
          // Example:
          // axios.post(`http://${ip}:8000/update-vendor-image`, { userId: vendorInfo.userId, image: response.uri });
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePicker} style={styles.imageIconContainer}>
        <MaterialIcons name="account-circle" size={150} color="#3498db" />
      </TouchableOpacity>
      {vendorImage && (
        <Image source={{ uri: vendorImage }} style={styles.profileImage} />
      )}
      <Text style={styles.username}>{vendorInfo.username}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Name</Text>
        <Text style={styles.infoText}>{vendorInfo.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoText}>{vendorInfo.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>CNIC</Text>
        <Text style={styles.infoText}>{vendorInfo.cnic}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Phone Number</Text>
        <Text style={styles.infoText}>{vendorInfo.phoneNumber}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Address</Text>
        <Text style={styles.infoText}>{vendorInfo.address}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Province</Text>
        <Text style={styles.infoText}>{vendorInfo.province}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>City</Text>
        <Text style={styles.infoText}>{vendorInfo.city}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Category</Text>
        <Text style={styles.infoText}>{vendorInfo.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditVendorProfile')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ecf0f1', // Light gray background color
  },
  imageIconContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#666',
  },
  infoText: {
    flex: 2,
    fontSize: 16,
    color: '#444',
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginLeft: 10,
  },
});

export default Vendorprofile;
