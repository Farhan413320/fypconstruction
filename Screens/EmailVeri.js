import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import ip from "../ipconfig";

const OTPVerify = () => {
  const navigation = useNavigation();
  const [otp, setOTP] = useState('');
  
  const handleVerify = () => {
    if (otp.length === 4) {
      navigation.navigate('NewPass');
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Resent', 'OTP resent to your email successfully.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.UpperContainer}>
        <Text style={styles.welcomeText}>Email Verification</Text>
      </View>
      <View style={styles.formContainer}>
         <View style={styles.centContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  keyboardType="numeric"
                  maxLength={4}
                  onChangeText={setOTP}
                  value={otp}
                />
            </View>
        </View>
        <Text style={styles.confirmText} onPress={handleResend}>Resend Code</Text>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleVerify}>
          <Text style={styles.loginButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250,125,84,255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  UpperContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white',
  },
  centContainer: {
    flexDirection:'row',
    justifyContent: 'center',
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
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#CCCCCC',
  },
  input: {
    height: 60,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'rgba(250,125,84,255)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop:10
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmText: {
    textAlign: 'right',
  },
});

export default OTPVerify;
