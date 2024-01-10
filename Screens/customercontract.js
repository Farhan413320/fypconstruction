import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import ip from '../ipconfig';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useProposalContext } from '../proposalcontext'; // Adjust the path accordingly

const ContractScreen = ({ navigation }) => {
  const { selectedProposal } = useProposalContext();
 // const [proofOfPaymentImage, setProofOfPaymentImage] = useState(null);
  const [image, setImage] = useState(null); 
  const [userBankAccountHolder, setUserBankAccountHolder] = useState('');
  const [userBankAccountNumber, setUserBankAccountNumber] = useState('');
  const [adminFee, setAdminFee] = useState(0);
  const [acceptedBid, setAcceptedBid] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: 'Muhammad Farhan',
    accountNumber: '98530105197436',
    bankName: 'Meezan Bank',
  });

  useEffect(() => {
    const fetchAcceptedBids = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/proposalacceptedbid/${selectedProposal._id}`);
        setAcceptedBid(response.data);
        const adminFeePercentage = 0.07;
        const bidAmount = response.data.bidInfo.amount;
        const calculatedAdminFee = bidAmount * adminFeePercentage;
        setAdminFee(calculatedAdminFee);
      } catch (error) {
        console.error('Error fetching accepted bids:', error);
      }
    };

    fetchAcceptedBids();
  }, [selectedProposal._id]);

  const handleImageUpload = async (index) => {
    try {
      const selectedImage = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true, // Enable cropping
        multiple: false, // Allow selecting only one image
        mediaType: 'photo', // Set this to 'photo' or 'video' based on your requirements
      });

      // Image selected or captured successfully, update the images state
      
  
    setImage(selectedImage.path);
    console.log(selectedImage.path);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        // Handle errors, excluding cancellation
        Alert.alert('Image Picker Error', error.message);
      }
    }
  };


  const handleConfirmContract = async () => {
    // Validate and save the contract
    if (!image || !userBankAccountHolder || !userBankAccountNumber) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(userBankAccountHolder)) {
      Alert.alert('Error', 'Account Holder Name should only contain alphabets and spaces');
      return;
    }
  
    // Validate userBankAccountNumber (only numbers allowed)
    const numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(userBankAccountNumber)) {
      Alert.alert('Error', 'Account Number should only contain numbers');
      return;
    }

    try {
        // Upload image to the server
        const imageFormData = new FormData();
        console.log(image);
        imageFormData.append('proofOfPayment', {
          uri: image,
          type: 'image/jpeg',
          name: 'proofOfPayment.jpg',
        });
   // console.log("hell");
    const imageUploadResponse = await axios.post(`http://${ip}:8000/paymentproofupload`, imageFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
      //  console.log(imageUploadResponse.data.imageUrl);
        const uploadedImageUrl = imageUploadResponse.data.imageUrl;
   // console.log( uploadedImageUrl);
        // Create a contract data object
        const contractData = {
            vendorId: acceptedBid.vendorInfo.vendorId,
            userId: selectedProposal.userId,
            userBankAccountHolder,
            userBankAccountNumber,
            proofOfPaymentUrl: uploadedImageUrl,
            adminFee: adminFee.toFixed(2),
            totalBidAmount: acceptedBid.bidInfo.amount,
            proposalDetails: {
              title: selectedProposal.title,
              startDate: selectedProposal.startDate,
              endDate: selectedProposal.endDate,
              address: selectedProposal.address,
              categories: selectedProposal.selectedCategories,
              description: selectedProposal.description,
              
            },
            
          };
    
       
        const contractResponse = await axios.post(`http://${ip}:8000/savecontract`, contractData);
    
       
        const successMessage = contractResponse.data.message;
    
        Alert.alert('contract submitted for approval', successMessage);
    
       navigation.navigate('Home');
      } catch (error) {
        console.error('Error confirming contract:', error);
        Alert.alert('Error', 'An error occurred while confirming the contract. Please try again.');
      }
  

    
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Proposal Details</Text>
      </View>

      {/* Proposal Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Title:</Text>
          <Text style={styles.detailsText}>{selectedProposal.title}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Start Date:</Text>
          <Text style={styles.detailsText}>
            {new Date(selectedProposal.startDate).toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>End Date:</Text>
          <Text style={styles.detailsText}>
            {new Date(selectedProposal.endDate).toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Address:</Text>
          <Text style={styles.detailsText}>{selectedProposal.address}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Categories:</Text>
          <Text style={styles.detailsText}>
            {selectedProposal.selectedCategories.join(', ')}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Description:</Text>
          <Text style={styles.detailsText}>{selectedProposal.description}</Text>
        </View>
      </View>

      {/* Bids Section */}
      <Text style={styles.bidsTitle}>Bids:</Text>
      {acceptedBid && (
        <View style={styles.bidItem}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Vendor Name:</Text>
            <Text style={styles.detailsText}>{acceptedBid.vendorInfo.vendorName}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Address:</Text>
            <Text style={styles.detailsText}>{acceptedBid.vendorInfo.address}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>City:</Text>
            <Text style={styles.detailsText}>{acceptedBid.vendorInfo.city}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Bid Amount:</Text>
            <Text style={styles.detailsText}>{acceptedBid.bidInfo.amount} PKR</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Bid Detail:</Text>
            <Text style={styles.detailsText}>{acceptedBid.bidInfo.details}</Text>
          </View>
        </View>
      )}

<Text style={styles.importantMessage}>
        You have to pay {adminFee.toFixed(2)} PKR (7% of the total contract amount) to the admin for security. this will be compensated at the end of the contract.
        Pay the requested amount and upload payment proof.
      </Text>

      {/* Bank Details Section */}
      <View style={styles.bankDetailsContainer}>
        <Text style={styles.bankDetailsTitle}>Bank Account Details</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Account Holder Name:</Text>
          <Text style={styles.detailsText}>{bankDetails.accountHolderName}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Account Number:</Text>
          <Text style={styles.detailsText}>{bankDetails.accountNumber}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Bank Name:</Text>
          <Text style={styles.detailsText}>{bankDetails.bankName}</Text>
        </View>
      </View>

       {/* Account Holder Name and Account Number Fields */}
       <TextInput
        style={styles.input}
        placeholder="Enter Account Holder Name"
        onChangeText={(text) => setUserBankAccountHolder(text)}
        value={userBankAccountHolder}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Account Number"
        onChangeText={(text) => setUserBankAccountNumber(text)}
        value={userBankAccountNumber}
      />

      {/* Image Upload Section */}
      <View style={styles.imageUploadContainer}>
        <TouchableOpacity style={styles.imageUploadIcon} onPress={handleImageUpload}>
          <MaterialIcons name="attach-file" size={30} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.imageUploadText}>Upload Proof of Payment</Text>
        {image && (
          <Image source={{ uri: image }} style={styles.uploadedImage} resizeMode="cover" />
        )}
      </View>

      {/* Confirm Contract Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmContract}>
        <Text style={styles.confirmButtonText}>Confirm Contract</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'left',
    marginBottom: 12,
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
  },
  importantMessage: {
    fontSize: 16,
    color: 'red',
    marginBottom: 5,
  },
  headerIcon: {
    marginRight: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
  detailsContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'right',
    marginTop: 20,
  },
  imageUploadIcon: {
    marginRight: 10,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 3,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
   // paddingTop:10,
   marginTop:10,
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 16,
  },
  bidsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bidItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bankDetailsContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bankDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  imageUploadIcon: {
    marginRight: 10,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContractScreen;
