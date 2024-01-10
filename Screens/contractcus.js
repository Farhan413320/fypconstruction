import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import ip from '../ipconfig';

const ContractsScreen = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://${ip}:8000/fetchingcustomercontracts/${userId}`);

        if (response.status === 200) {
          setContracts(response.data);
        } else {
          console.log('Failed to retrieve contracts. Status code:', response.status);
        }
      } catch (error) {
        console.log('Error retrieving contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prevOpenSections) => {
      const isSectionOpen = !!prevOpenSections[section];
      return { ...prevOpenSections, [section]: !isSectionOpen };
    });
  };

  const SectionHeader = ({ title, sectionKey }) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(sectionKey)}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <MaterialIcons
        name={openSections[sectionKey] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
        size={24}
        color="#000"
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.contractItem}>
      <SectionHeader title="Proposal Details" sectionKey="proposal" />
  
      {openSections['proposal'] && item.proposalDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeading}>Title:</Text>
          <Text style={styles.detailText}>{item.proposalDetails.title}</Text>
          <Text style={styles.detailsHeading}>Start Date:</Text>
          <Text style={styles.detailText}>
            {new Date(item.proposalDetails.startDate).toLocaleDateString()}
          </Text>
          <Text style={styles.detailsHeading}>End Date:</Text>
          <Text style={styles.detailText}>
            {new Date(item.proposalDetails.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.detailsHeading}>Address:</Text>
          <Text style={styles.detailText}>{item.proposalDetails.address}</Text>
          <Text style={styles.detailsHeading}>Categories:</Text>
          <Text style={styles.detailText}>
            {item.proposalDetails.categories.join(', ')}
          </Text>
          <Text style={styles.detailsHeading}>Description:</Text>
          <Text style={styles.detailText}>{item.proposalDetails.description}</Text>
        </View>
      )}
  
      <SectionHeader title="Bid Section" sectionKey="bid" />
  
      {openSections['bid'] && item.adminFee && item.totalBidAmount && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeading}>Admin Fee:</Text>
          <Text style={styles.detailText}>{`${item.adminFee}`}</Text>
          <Text style={styles.detailsHeading}>Total Bid Amount:</Text>
          <Text style={styles.detailText}>{`${item.totalBidAmount}`}</Text>
        </View>
      )}
  
      <SectionHeader title="Status Section" sectionKey="status" />
  
      {openSections['status'] && item.contractStatus && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeading}>Status:</Text>
          <Text style={styles.detailText}>{item.contractStatus}</Text>
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Contracts</Text>
      {loading ? (
        <Text>Loading contracts...</Text>
      ) : contracts.length === 0 ? (
        <Text>No contracts found.</Text>
      ) : (
        <FlatList
          data={contracts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex: 1 to make it take the full height of the screen
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contractItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 8,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
});

export default ContractsScreen;
