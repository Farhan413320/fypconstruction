import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";

import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { UserType } from "../UserContext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import ip from "../ipconfig";
import User from "../components/User";
const Chatscreen = ({navigation}) => {
  
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
 

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      
      

      axios
        .get(`http://${ip}:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  console.log("users", users);
  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default Chatscreen;

const styles = StyleSheet.create({});
