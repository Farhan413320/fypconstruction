import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
    fetchProposals();
  }, []);

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
              <Text style={styles.title}>Title: {item.title}</Text>
              <Text style={styles.description}>Description: {item.description}</Text>
              <Text style={styles.timestamp}>
                {formatDateTime(item.createdAt)}
              </Text>
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
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIcon: {
    padding: 8,
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
  addButton: {
    position: 'absolute',
    right: 35,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RFPSection;
