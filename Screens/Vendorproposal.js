// VendorProposalSection.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { UserType } from "../UserContext.js";
import { useProposalContext } from "../proposalcontext.js";
import ip from "../ipconfig";
import jwt_decode from "jwt-decode";

const Vendorproposal = ({ navigation }) => {
  const [proposals, setProposals] = useState([]);
  const { userId ,setUserId} = useContext(UserType); // Assuming you have only userId in UserContext
  const { setProposal } = useProposalContext();
  const [vendorCategory, setVendorCategory] = useState(""); // State to store the vendor's category

  useEffect(() => {
    // Fetch the vendor's category based on userId
    const fetchVendorCategory = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      //console.log(userId);
      try {
        const response = await axios.get(`http://${ip}:8000/get-vendor-category/${userId}`);
        setVendorCategory(response.data.vendorcategory);
       // console.log(vendorCategory);
      } catch (error) {
        console.log("Error fetching vendor category", error);
      }
    };

    fetchVendorCategory();
  }, [userId]);

  useEffect(() => {
    // Fetch proposals matching the vendor's category
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/get-matching-proposals/${vendorCategory}`);
        setProposals(response.data);
        console.log(proposals);
      } catch (error) {
        console.log("Error fetching proposals", error);
      }
    };

    if (vendorCategory) {
      fetchProposals();
    }
  }, [vendorCategory]);

  const handleItemPress = (item) => {
    setProposal(item);
    navigation.navigate('proposaldetailscreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Proposals in Your Category</Text>
      <FlatList
        data={proposals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.proposalItem}>
              <Text style={styles.title}>Title: {item.title}</Text>
              <Text style={styles.description}>Description: {item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'white',
  },
  header: {
    height:60,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    backgroundColor:'black',
    color:'white',
    paddingLeft:12,
    paddingTop:12,
  },
  proposalItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderColor: 'black', // Black border color
    borderWidth: 2, // Increase border width for emphasis
  },
  title: {
    fontWeight: 'bold', // Bold title
    fontSize: 18, // Adjust the font size as needed
    color: 'black', // Black font color
    marginBottom: 8, // Add some spacing between title and description
  },
  description: {
    color: 'black', // Black font color for description
  },
  
});






export default Vendorproposal;
