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
import { useNavigation } from '@react-navigation/native';
import Vendorbid from './Vendorbids.js';
import { createStackNavigator } from '@react-navigation/stack';




const Stack = createStackNavigator();

// Create a component for the stack navigator
const Proposalstack= () => {
  return (
    <Stack.Navigator initialRouteName="Vendorproposal" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vendorproposal" component={Vendorproposal} />
      <Stack.Screen name="Vendorbids" component={Vendorbid} />
      
     
      
    </Stack.Navigator>
  );
};

const Vendorproposal = () => {
  const [proposals, setProposals] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const { setProposal } = useProposalContext();
  const [vendorCategory, setVendorCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
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
    navigation.navigate('Vendorbids');
  };

  
  const getStatusColor = (status) => {
    return status === 'open' ? 'green' : 'red';
  };
  const formatDateTime = (dateTime) => {
    
    return moment(dateTime).format("MMM D, YYYY HH:mm A");
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
              <View style={styles.statusTimestampContainer}>
                <Text style={{ ...styles.status, color: getStatusColor(item.status) }}>
                  {item.status}
                </Text>
                <Text style={styles.timestamp}>
                  Created: {moment(item.createdAt).format("MMM D, YYYY HH:mm A")}
                </Text>
              </View>
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
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshButton: {
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 5,
  },
  proposalItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    color: '#555555',
  },
  statusTimestampContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#007BFF', // Use a different color for status
  },
  timestamp: {
    fontSize: 13,
    marginTop: 8,
    color: '#777777',
  },
});

export default Proposalstack;
