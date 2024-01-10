import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from 'react-native-vector-icons';
import { UserType } from "../UserContext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useVendorContext } from '../VendorContext';
import ip from "../ipconfig";
//import { useNavigation } from "@react-navigation/native";

const Chatscreen = ({navigation}) => {
  const { userId, setUserId } = useContext(UserType);
  const [chats, setChats] = useState([]);
  const { setVendId } = useVendorContext();
 // const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        const response = await axios.get(`http://${ip}:8000/chats/${userId}`);
        console.log(response.data);
        if (response.status === 200) {
          setChats(response.data);
        } else {
          console.log("Failed to retrieve chats. Status code:", response.status);
        }
      } catch (error) {
        console.log("Error retrieving chats:", error);
      }
    };

    fetchChats();
  }, []);

  const handleChatPress = (vendorId) => {
    setVendId(vendorId);
   
    navigation.navigate('chatinbox');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {chats.length === 0 ? (
          <Text style={styles.noChatsText}>Currently, you have no chats with vendors.</Text>
        ) : (
          chats.map((chat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chatItem}
              onPress={() => handleChatPress(chat.vendorId)} 
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{chat.vendorName.charAt(0)}</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.vendorName}>{chat.vendorName}</Text>
                <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
              </View>
              <View style={styles.timestampContainer}>
                <Text style={styles.timestamp}>{chat.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#FFF", 
  },
  scrollViewContent: {
    paddingVertical: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16, 
    backgroundColor: "#EFEFEF", 
    borderBottomWidth: 1,
    borderBottomColor: "#DDD", 
  },
  avatarContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#007BFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18, 
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 16, 
    color: "#555", 
  },
  timestampContainer: {
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
  },
  noChatsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20, 
  },
});

export default Chatscreen;
