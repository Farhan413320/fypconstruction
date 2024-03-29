import React, { useState , useEffect} from 'react';
import { View, Text, TextInput,Alert, TouchableOpacity, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ip from "../ipconfig";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");

  //       if (token) {
  //         navigation.replace("Home");
  //       } else {
  //          "token not found , show the login screen itself"
  //                 }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  const handleForgot = () => {
    navigation.navigate('Forgotpass');
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  };

  const handleCreate = () => {
    Alert.alert(
      "Register as",
      "Choose your user type:",
      [
        {
          text: "Customer",
          onPress: () => {
            navigation.navigate('RegisterCust');
            setEmail('');
            setPassword('');
            setEmailError('');
            setPasswordError('');
          },
        },
        {
          text: "Vendor",
          onPress: () => {
            navigation.navigate('RegisterasVendor');
            setEmail('');
            setPassword('');
            setEmailError('');
            setPasswordError('');
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogin = () => {
    
    setEmailError('');
    setPasswordError('');

    
    if (!email) {
      setEmailError('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email');
      return;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    const user = {
      email: email,
      password: password,
    };
//console.log(ip);
    axios
      .post(`http://${ip}:8000/login`, user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        const userType = response.data.userType;
        

        if (userType === 'User') {
          navigation.replace('Home');
        } else if (userType === 'Vendor') {
          navigation.replace('VendorHome');
        } else {
          // Handle unknown userType
          Alert.alert('Login Error', 'Invalid user type');
        }

      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log("Login Error", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, emailError && { borderColor: 'red' }]}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}
        </View>
        <View style={[styles.inputContainer, passwordError && { borderColor: 'red' }]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}
        </View>
        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgot}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.texx}> Not have an account yet?
        <Text style={styles.createAccountText } onPress={handleCreate}> Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  formContainer: {
    flex: 2,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  input: {
    paddingHorizontal: 12,
    height: 60,
    fontSize:16,
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#555555',
  },
  loginButton: {
    
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 5,
    
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createAccountText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
  },
  texx: {
    textAlign: 'center',
  },
});

export default LoginScreen;
