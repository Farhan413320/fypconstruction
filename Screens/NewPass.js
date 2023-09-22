import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import ip from "../ipconfig";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleResetPassword = () => {
    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Invalid Password',
        'Please enter a valid password. It should be at least 8 characters long and contain at least one capital letter, one digit, and one special character.'
      );
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The entered passwords do not match. Please enter the correct password.');
      return;
    }

    // Password reset successful
    Alert.alert('Password Reset', 'Your password has been reset successfully.');
    navigation.navigate('Login');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.header}>Reset Password</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Re-enter New Password"
            secureTextEntry={!isConfirmPasswordVisible}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleConfirmPasswordVisibility}
          >
            <Icon
              name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
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
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  inputContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formContainer: {
    flex: 2,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    flex: 1,
  },
  iconContainer: {
    padding: 8,
  },
  button: {
    backgroundColor: 'rgba(250, 125, 84, 255)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
