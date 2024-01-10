import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { UserType } from "../UserContext.js";
import ip from "../ipconfig";
import { useProposalContext } from "../proposalcontext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import moment from 'moment';

const RFPSection = ({ navigation }) => {
  const [proposals, setProposals] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const { setProposal } = useProposalContext();
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused(); // Hook to determine if the screen is focused

  const fetchProposals = async () => {
    setRefreshing(true);
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);

    axios
      .get(`http://${ip}:8000/get-proposal/${userId}`)
      .then((response) => {
        const sortedProposals = response.data.sort((a, b) => {
          return moment(b.createdAt) - moment(a.createdAt);
        });
        setProposals(sortedProposals);
      })
      .catch((error) => {
        console.log("Error retrieving proposals", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchProposals();
    }
  }, [isFocused]);

  const handleItemPress = (item) => {
    setProposal(item);
    navigation.navigate('proposaldetailscreen');
  };

  const handleRefresh = () => {
    fetchProposals();
  };

  const formatDateTime = (dateTime) => {
    const momentDateTime = moment(dateTime);
    if (moment().diff(momentDateTime, 'hours') < 24) {
      return momentDateTime.fromNow();
    } else {
      return momentDateTime.format('MMM D, YYYY HH:mm A');
    }
  };

  const getStatusColor = (status) => {
    return status === 'open' ? 'green' : 'red';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Proposals</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.headerIcon}>
          <AntDesign name="reload1" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateRFP')}
        >
          <AntDesign name="plus" size={35} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={proposals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.proposalItem}>
              <View style={styles.leftContent}>
                <Text style={styles.title}>Title: {item.title}</Text>
                <Text style={styles.description}>Description: {item.description}</Text>
              </View>
              <View style={styles.rightContent}>
                <Text style={{ ...styles.status, color: getStatusColor(item.status) }}>
                  {item.status}
                </Text>
                <Text style={styles.timestamp}>
                  {formatDateTime(item.createdAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  plusIcon: {
    color: 'white',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIcon: {
    padding: 16,
  },
  proposalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2, // Add elevation for a subtle shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
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
  status: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007BFF', // Use a different color for status
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
    color: '#777777',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#333333',
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Add elevation for a subtle shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default RFPSection;
