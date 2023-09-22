import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import ip from "../ipconfig";

const PasswordReset = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
    return;
  };

  const handleResetPassword = () => {
    setEmailError('');
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

    
    navigation.navigate('EmailVeri');
    
    // Perform password reset logic if validation passes
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.welcomeText}>Forgot Password</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.topAccountText}>
            Enter a registered email address to receive a password reset OTP.</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            onBlur={validateEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword}>
          <Text style={styles.loginButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 125, 84, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upperContainer: {
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
  inputContainer: {},
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: 'rgba(250, 125, 84, 255)',
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
  topAccountText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default PasswordReset;
