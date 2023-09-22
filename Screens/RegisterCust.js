import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import axios from 'axios';
import ip from "../ipconfig";


const RegisterasCustomer = ({navigation}) => {
  
  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [Confirmpassword, setConfirmpassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameerror, setusernameerror] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setEmailError('Email is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
    return;
  };


  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password === '') {
      setPasswordError('Password is required');
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      );
    } else {
      setPasswordError('');
    }
    return;
  };

  const handleRegister = () => {
   
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Please enter your email');
      return;
    }

    // Validate email and password
    if (!username) {
      setusernameerror('Please enter your username');
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
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password should be at least 8 characters long having capital letter,digit, and one special character.');
      return;
    }
    if (password !== Confirmpassword) {
      
      
      setPasswordMatchError("Password did not matched.");
      return;
    }

    const user = {
      username: username,
      email: email,
      password: password,
    };

    axios
    .post(`http://${ip}:8000/register`, user)
    .then((response) => {
      console.log(response);
      Alert.alert(
        "Registration successful",
        "You have been registered Successfully"
      );
      navigation.navigate('Login');
      setusername("");
      setEmail("");
      setPassword("");
      setConfirmpassword("");
    })
    .catch((error) => {
      Alert.alert(
        "Registration Error",
        "An error occurred while registering"
      );
      console.log("registration failed", error);
    });
     
    
  };

  const handlesignin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Register as Customer</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
          value={username}
            style={styles.input}
            placeholder="Username"
            keyboardType="email-address"
            onChangeText={(text) => setusername(text)}
            
          />
          {usernameerror !== '' && <Text style={styles.errorText}>{usernameerror}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            onBlur={validateEmail}
          />
          {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            onBlur={validatePassword}
          />
          {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            value={Confirmpassword}
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            onChangeText={(text) => setConfirmpassword(text)}
            
          />
          {passwordMatchError !== '' && <Text style={styles.errorText}>{passwordMatchError}</Text>}
      
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginAccountText} onPress={handlesignin}>
        <Text style={styles.texx} >
          Already have an account? <Text style={styles.loginAccountText2}>Sign in</Text>
        </Text>
        </TouchableOpacity>
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
  texx: {
    textAlign: 'center', 
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
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginAccountText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  loginAccountText2: {
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'center',
    color: '#555555',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default RegisterasCustomer;
