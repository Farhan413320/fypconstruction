import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import ip from '../ipconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const ComplaintScreen = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://${ip}:8000/get-complaintsnot/${userId}`);
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error.message);
      }
    };

    fetchData();
  }, []); 

  return (
    <View style={styles.container}>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item._id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.complaintItem}>
            <Text style={styles.complaintText}>{`Complaint: ${item.complaint}`}</Text>
            <Text style={styles.dateText}>{`Date: ${new Date(item.chatDate).toLocaleString()}`}</Text>
            {item.admincomment ? (
              <Text style={styles.adminResponse}>{`Admin Response: ${item.admincomment}`}</Text>
            ) : (
              <Text style={styles.pendingResponse}>Pending Admin Response</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  complaintItem: {
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '90%', 
    alignSelf: 'center', 
  },
  complaintText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  dateText: {
    fontSize: 14,
    color: '#7f8c8d', 
  },
  adminResponse: {
    fontSize: 16,
    color: '#27ae60', 
  },
  pendingResponse: {
    fontSize: 16,
    color: '#e74c3c', 
  },
});

export default ComplaintScreen;
