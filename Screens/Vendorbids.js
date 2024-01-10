import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useProposalContext } from '../proposalcontext.js'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import ip from "../ipconfig";// Import the proposal context
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
const VendorBid = () => {
  const { selectedProposal, setProposal } = useProposalContext(); 
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [vendorBid, setVendorBid] = useState(null); 

  const navigation = useNavigation(); 

  // Function to check if the vendor has already submitted a bid
  const checkVendorBid = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

     
      const existingBid = selectedProposal.bids.find(bid => bid.vendorId === userId);

      if (existingBid) {
       
        setVendorBid(existingBid);
        setBidSubmitted(true);
      }
    } catch (error) {
      console.error('Error checking vendor bid:', error);
    }
  };

  useEffect(() => {
   
    checkVendorBid();
  }, []);

  
  const submitBid = async () => {
    if (!amount || !details) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      const bidData = {
        proposalId: selectedProposal._id,
        vendorId: userId,
        amount: parseFloat(amount),
        details: details,
      };

      
      const response = await axios.post(`http://${ip}:8000/submit-bid`, bidData);

     
      if (response.status === 201) {
       
        const updatedProposal = { ...selectedProposal };
        updatedProposal.bids.push(response.data.bid); 

       
        setProposal(updatedProposal);

       
        setVendorBid(response.data.bid);
        setBidSubmitted(true);
      } else {
        Alert.alert('Error', 'Bid submission failed.');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Bid submission failed.');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Proposal Details</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Title: {selectedProposal.title}</Text>
        <Text style={styles.description}>Description: {selectedProposal.description}</Text>
        <Text style={styles.description}>Sub Category: {selectedProposal.subCategory}</Text>
        <Text style={styles.description}>Sub Type: {selectedProposal.subtype}</Text>
        <Text style={styles.description}>Customer Budget: {selectedProposal.budget} PKR</Text>
        <Text style={styles.description}>Customer Address: {selectedProposal.address}</Text>
        <Text style={styles.status}>Status: {selectedProposal.status}</Text>
        <Text style={styles.timestamp}>Created: {selectedProposal.createdAt}</Text>
      </View>

      {bidSubmitted && (
        <View style={styles.bidDetailsContainer}>
          <Text style={styles.header}>Your Bid Details</Text>
          <Text style={styles.title}>Bid Amount:{vendorBid.amount} Pkr</Text>
          <Text style={styles.description}>Bid Details: {vendorBid.details}</Text>
          <Text style={styles.status}>Bid Status: {vendorBid.status}</Text>
        </View>
      )}

      {!bidSubmitted && (
        <View style={styles.bidFormContainer}>
          <Text style={styles.header}>Submit Your Bid</Text>
          <TextInput
            style={styles.input}
            placeholder="Bid Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Bid Details"
            multiline
            numberOfLines={4}
            value={details}
            onChangeText={(text) => setDetails(text)}
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitBid}>
            <Text style={styles.submitButtonText}>Submit Bid</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 16,
    color: 'black',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  bidDetailsContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginBottom: 8,
  },
  description: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  timestamp: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 8,
  },
  bidFormContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
export default VendorBid;
