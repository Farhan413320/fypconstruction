
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ip from '../ipconfig';
import axios from 'axios';
import { useProposalContext } from '../proposalcontext.js';
import { useVendorContext } from '../VendorContext';
import ImageZoom from 'react-native-image-pan-zoom';


const ProposalDetailsScreen = ({ navigation }) => {
  const { selectedProposal } = useProposalContext();
  const [isBidAccepted, setIsBidAccepted] = useState(false);
  const [bids, setBids] = useState([]);
  const { setProposal } = useProposalContext();
  const { setVendId } = useVendorContext();
  const [imageURLs, setImageURLs] = useState([]);
  const [zoomImageIndex, setZoomImageIndex] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [vendorRating, setVendorRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState(null);
  
  
 

  const handleVendorDetails = async (vendorId) => {
    try {
     // console.log(vendorId);
      const response = await axios.get(`http://${ip}:8000/vendorproposaldetails/${vendorId}`);
     // console.log(response.data);
      const { totalOrders, rating, reviews } = response.data;
      setTotalOrders(totalOrders);
      setVendorRating(rating);
      setReviews(reviews);
      setShowVendorDetails(true);
      setShowVendorDetails(!showVendorDetails);
    } catch (error) {
      console.error('Error fetching vendor details', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://${ip}:8000/delete-proposal/${selectedProposal._id}`);

      Alert.alert('Proposal Deleted', 'The proposal has been deleted successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to the previous screen
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting proposal', error);
    }
  };
  const handleToggleProductType = (productType) => {
    const updatedProductTypes = selectedProductTypes.includes(productType)
      ? selectedProductTypes.filter((type) => type !== productType)
      : [...selectedProductTypes, productType];
    setSelectedProductTypes(updatedProductTypes);
  };

  const handleApplyFilter = () => {
    setShowFilterOptions(false);
  
    // Filter reviews based on selected product types
    const updatedFilteredReviews = reviews.filter((review) =>
      selectedProductTypes.some((type) => review.productName.toLowerCase().includes(type))
    );
  
    setFilteredReviews(updatedFilteredReviews);
  };

  const handleAcceptBid = async (vendorId) => {
    console.log(vendorId);
    try {
      Alert.alert(
        'Confirm Acceptance',
        'Are you sure you want to accept this bid?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Accept',
            onPress: async () => {
              await axios.post(`http://${ip}:8000/accept-bid/${selectedProposal._id}/${vendorId}`);
              setIsBidAccepted(true);
             // setProposal(selectedProposal._id);

              Alert.alert('Bid Accepted', 'The bid has been accepted successfully', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate to the next screen
                    navigation.navigate('customercontract');
                  },

                },
              ]);
  
              // setIsBidAccepted(true, () => {
              //   console.log('isBidAccepted:', isBidAccepted);
              // });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error accepting bid', error);
    }
  };
  // useEffect(() => {
    
  //  // console.log('isBidAccepted:', isBidAccepted);

    
  //   if (isBidAccepted) {
     
  //     navigation.navigate('customercontract');
  //   }
  // }, [isBidAccepted]);

  // const handleRejectBid = async (bidId) => {
  //   try {
  //     await axios.post(`http://${ip}:8000/reject-bid/${selectedProposal._id}/${bidId}`);
  //   } catch (error) {
  //     console.error('Error rejecting bid', error);
  //   }
  // };

  const handleChatWithVendor = (vendorId) => {
    setVendId(vendorId);
   
    navigation.navigate('chatinbox');

  };

  const handleImageDownload = (imageURL) => {
    // Use Linking to download the image
    Linking.openURL(imageURL);
  };
  const handleMoveToContract = () => {
    console.log('Move to Contract button pressed');
    navigation.navigate('customercontract'); 
  };

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const response = await axios.get(`http://${ip}:8000/proposalwithbids/${selectedProposal._id}`);
        const proposalData = response.data;
        setBids(proposalData.bids);

        const imageResponse = await axios.get(`http://${ip}:8000/fetchimageurls/${selectedProposal._id}`);
        setImageURLs(imageResponse.data.imageURLs);
      } catch (error) {
        console.error('Error fetching proposal details', error);
      }
    };

    fetchProposalDetails();
  }, [selectedProposal._id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Proposal Details</Text>
      </View>

      <View style={styles.detailsContainer}>
  <View style={styles.detailsColumn}>
    <Text style={styles.detailsLabel}>Title:</Text>
    <Text style={styles.detailsLabel}>Categories:</Text>
    <Text style={styles.detailsLabel}>Subcategory:</Text>
    <Text style={styles.detailsLabel}>SubType:</Text>
    <Text style={styles.detailsLabel}>Description:</Text>
    <Text style={styles.detailsLabel}>Budget:</Text>
    <Text style={styles.detailsLabel}>Start Date:</Text>
    <Text style={styles.detailsLabel}>End Date:</Text>
    <Text style={styles.detailsLabel}>Address:</Text>
    
    
  </View>
  <View style={styles.detailsColumn}>
    <Text style={styles.detailsText}>{selectedProposal.title}</Text>
    <Text style={styles.detailsText}>{selectedProposal.selectedCategories.join(', ')}</Text>
    <Text style={styles.detailsText}>{selectedProposal.subCategory}</Text>
    <Text style={styles.detailsText}>{selectedProposal.subtype}</Text>
    <Text style={styles.detailsText}>{selectedProposal.description}</Text>
    <Text style={styles.detailsText}>{selectedProposal.budget} PKR</Text>
    <Text style={styles.detailsText}>{new Date(selectedProposal.startDate).toLocaleString()}</Text>
    <Text style={styles.detailsText}>{new Date(selectedProposal.endDate).toLocaleString()}</Text>
    <Text style={styles.detailsText}>{selectedProposal.address}</Text>
    
   
  </View>
</View>

      <Text style={styles.imageTitle}>Proposal Images:</Text>
      <View style={styles.imageContainer}>
        {imageURLs.map((imageURL, index) => (
          <TouchableOpacity key={index} onPress={() => setZoomImageIndex(index)}>
            <ImageZoom cropWidth={200} cropHeight={200} imageWidth={200} imageHeight={200}>
              <Image source={{ uri: imageURL }} style={styles.userImage} />
            </ImageZoom>
            <TouchableOpacity onPress={() => handleImageDownload(imageURL)} style={styles.downloadButton}>
              <MaterialIcons name="file-download" size={20} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.bidsTitle}>Bids:</Text>
      {bids.map((item, index) => (
  <View style={styles.bidItem} key={index}>
    <View style={styles.bidHeader}>
      <Text style={styles.vendorName}>Vendor: {item.vendorName}</Text>
      <TouchableOpacity
        style={styles.vendorDetailsButton}
        onPress={() => handleVendorDetails(item.vendorId)}
      >
        <MaterialIcons name="keyboard-arrow-down" size={28} color="black" />
      </TouchableOpacity>
    </View>
    <Text style={styles.boldText}>Amount: {item.amount} PKR</Text>
    <Text style={styles.bidDetail}>Bid Detail: {item.details}</Text>
    <Text style={styles.bidTimestamp}>
      Bid Created: {new Date(item.createdAt).toLocaleString()}
    </Text>

    {showVendorDetails && (
  <View style={styles.vendorDetailsContainer}>
    <Text style={styles.detailsLabel}>Total Orders:</Text>
    <Text style={styles.detailsText}>{totalOrders}</Text>

    <Text style={styles.detailsLabel}>Rating:</Text>
    <View style={styles.ratingContainer}>
      {[...Array(Math.round(vendorRating))].map((_, i) => (
        <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
      ))}
    </View>
    <TouchableOpacity style={styles.filterIcon} onPress={() => setShowFilterOptions(true)}>
      <MaterialIcons name="filter-list" size={24} color="black" />
    </TouchableOpacity>

    {showFilterOptions && (
      <View style={styles.filterOptionsContainer}>
        <Text style={styles.filterOptionsTitle}>Select Product Types:</Text>
        {['cement', 'bricks', 'rait', 'bajri', 'steel', 'pipes'].map((productType) => (
          <TouchableOpacity
            key={productType}
            style={[
              styles.filterOption,
              selectedProductTypes.includes(productType) && styles.selectedFilterOption,
            ]}
            onPress={() => handleToggleProductType(productType)}
          >
            <Text>{productType}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.applyFilterButton}
          onPress={handleApplyFilter}
        >
          <Text style={styles.applyFilterButtonText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    )}

    {filteredReviews !== null ? (
      filteredReviews.map((review, reviewIndex) => (
        <View style={styles.reviewContainer} key={reviewIndex}>
          <Text style={styles.detailsLabel}>Customer Name:</Text>
          <Text style={styles.detailsText}>{review.customerName}</Text>
          <Text style={styles.detailsLabel}>Product Name:</Text>
          <Text style={styles.detailsText}>{review.productName}</Text>

          <Text style={styles.detailsLabel}>Rating:</Text>
          <View style={styles.ratingContainer}>
            {[...Array(review.rating)].map((_, i) => (
              <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
            ))}
          </View>

          <Text style={styles.detailsLabel}>Review:</Text>
          <Text style={styles.detailsText}>{review.comment}</Text>

          <Text style={styles.detailsText}>
            {new Date(review.timestamp).toLocaleString()}
          </Text>
        </View>
      ))
    ) : (
      reviews.map((review, reviewIndex) => (
        <View style={styles.reviewContainer} key={reviewIndex}>
          <Text style={styles.detailsLabel}>Customer Name:</Text>
          <Text style={styles.detailsText}>{review.customerName}</Text>
          <Text style={styles.detailsLabel}>Product Name:</Text>
          <Text style={styles.detailsText}>{review.productName}</Text>

          <Text style={styles.detailsLabel}>Rating:</Text>
          <View style={styles.ratingContainer}>
            {[...Array(review.rating)].map((_, i) => (
              <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
            ))}
          </View>

          <Text style={styles.detailsLabel}>Review:</Text>
          <Text style={styles.detailsText}>{review.comment}</Text>

          <Text style={styles.detailsText}>
            {new Date(review.timestamp).toLocaleString()}
          </Text>
        </View>
      ))
    )}
  </View>
)}

    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.acceptButton} onPress={isBidAccepted ? handleMoveToContract : () => handleAcceptBid(item.vendorId)}
          disabled={isBidAccepted} >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.chatButton} onPress={() => handleChatWithVendor(item.vendorId)}>
      <FontAwesome name="commenting" size={24} color="blue" />
    </TouchableOpacity>
  </View>
))}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Proposal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  reviewContainer: {
    marginBottom: 5,
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  headerIcon: {
    padding: 8,
  },
  filterIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  filterOptionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  filterOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: '#3498db', // Add your selected color
    padding: 8,
    borderRadius: 5,
  },
  applyFilterButton: {
    backgroundColor: '#2ecc71', // Add your button color
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  applyFilterButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 4,
  },
  bidDetail: {
    fontSize: 16,
    color: 'black',
    marginVertical: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8, 
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorDetailsButton: {
    backgroundColor: 'transparent',
  },
  vendorDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
 
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: 'white', 
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000', // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsColumn: {
    flex: 1,
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 17,
    color: 'black',
    marginBottom: 6,
  },
  imageTitle: {
        fontSize: 19, 
        fontWeight: 'bold',
        color: 'black',
        marginTop: 16,
      },
      imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
      },
      userImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        margin: 8,
      },
      downloadButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 50,
        padding: 5,
      },
      bidsTitle: {
        fontSize: 21, // Increased font size
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: 'black',
      },
      bidItem: {
        backgroundColor: 'lightgray',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000', // Shadow effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      vendorName: {
        fontSize: 19, // Increased font size
        fontWeight: 'bold',
        color: 'black',
      },
      bidAmount: {
        fontSize: 17, // Increased font size
        color: 'black',
      },
      bidTimestamp: {
        fontSize: 13, // Increased font size
        color: 'gray',
      },
      actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
      },
      acceptButton: {
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 8,
        flex: 1,
        marginRight: 4,
      },
      acceptButtonText: {
        color: 'white',
        fontSize: 17, // Increased font size
        fontWeight: 'bold',
        textAlign: 'center',
      },
      rejectButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 8,
        flex: 1,
        marginLeft: 4,
      },
      rejectButtonText: {
        color: 'white',
        fontSize: 17, // Increased font size
        fontWeight: 'bold',
        textAlign: 'center',
      },
      chatButton: {
        backgroundColor: 'transparent',
      },
      deleteButton: {
        backgroundColor: 'black',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
      },
      deleteButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17, // Increased font size
        fontWeight: 'bold',
      },
  
});

export default ProposalDetailsScreen;
