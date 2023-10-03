import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserType } from "../UserContext.js";
import { useProposalContext } from "../proposalcontext.js";
import ip from "../ipconfig";
import jwt_decode from "jwt-decode";
import moment from 'moment';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Vendorproposal = () => {
  const [proposals, setProposals] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const { setProposal } = useProposalContext();
  const [vendorCategory, setVendorCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

  useEffect(() => {
    // Fetch the vendor's category based on userId
    const fetchVendorCategory = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      try {
        const response = await axios.get(`http://${ip}:8000/get-vendor-category/${userId}`);
        setVendorCategory(response.data.vendorcategory);
      } catch (error) {
        console.log("Error fetching vendor category", error);
      }
    };

    fetchVendorCategory();
  }, [userId]);

  const fetchProposals = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`http://${ip}:8000/get-matching-proposals/${vendorCategory}`);
      const sortedProposals = response.data.sort((a, b) => moment(b.createdAt) - moment(a.createdAt));
      setProposals(sortedProposals);
    } catch (error) {
      console.log("Error fetching proposals", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (vendorCategory) {
      fetchProposals();
    }
  }, [vendorCategory]);

  const handleItemPress = (item) => {
    setProposal(item);
    navigation.navigate('VendorHome') // Use the navigation object from the nearest parent navigator
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Proposals in Your Category</Text>
        <TouchableOpacity onPress={fetchProposals} style={styles.refreshButton}>
          <FontAwesome name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={proposals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.proposalItem}>
              <Text style={styles.title}>Title: {item.title}</Text>
              <Text style={styles.description}>Description: {item.description}</Text>
              <Text style={styles.timestamp}>Created: {moment(item.createdAt).format("MMM D, YYYY HH:mm A")}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={fetchProposals}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'black',
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 5,
  },
  proposalItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginBottom: 8,
  },
  description: {
    color: 'black',
  },
  timestamp: {
    color: 'black',
    fontSize: 13,
    marginTop: 8,
  },
});

export default Vendorproposal;
