
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,Alert,
} from 'react-native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import ip from "../ipconfig";
import AntIcon from 'react-native-vector-icons/AntDesign';

const Register = ({navigation}) => {
  
  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isOpencategory, setIsOpencategory] = useState(false);
  const [selectedcategory, setSelectedcategory] = useState('');
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  


  const toggleDropdownProvince = () => {
    setIsOpenProvince(!isOpenProvince);
  };

  const handleOptionSelectProvince = (option) => {
    setSelectedProvince(option);
    setInputValue(option);
    setIsOpenProvince(false);
  };

  const toggleDropdowncategory = () => {
    setIsOpencategory(!isOpencategory);
  };

  const handleOptionSelectcategory = (option) => {
    setSelectedcategory(option);
    setInputValue(option);
    setIsOpencategory(false);
  };

  const toggleDropdownCity = () => {
    setIsOpenCity(!isOpenCity);
  };

  const handleOptionSelectCity = (option) => {
    setSelectedCity(option);
    setInputValue(option);
    setIsOpenCity(false);
  };

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

  const handleImageUpload = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // User cancelled the image picker
      } else if (response.error) {
        // Handle errors
      } else {
        // Selected image, set it in state and display a preview
        setProfilePicture(response.uri);
      }
    });
  };

  const handleRegister = () => {
    validateEmail();
    validatePassword();
    if (password !== confirmPassword) {
      
      
      setPasswordMatchError("Password did not matched.");
      return;
    }
    
    const registrationData = {
      username,
      email,
      password,
      name,
      cnic,
      phoneNumber,
      address,
      province: selectedProvince,
      city: selectedCity,
      category: selectedcategory, // Add the selected category here
    };

    axios
    .post(`http://${ip}:8000/vendorregister`, registrationData)
    .then((response) => {
      //console.log(response);
      Alert.alert(
        "Registration successful",
        "You have been registered Successfully"
      );
      navigation.navigate('Login');
     
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
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Register as Vendor</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              onBlur={validateEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              keyboardType="email-address"
              onChangeText={(text) => setCnic(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={toggleDropdownProvince}
            >
              <Text style={styles.dropdownLabel}>Province: {selectedProvince}</Text>
              <AntIcon
                name={isOpenProvince ? 'caretup' : 'caretdown'}
                size={16}
                color="#000000"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
            {isOpenProvince && (
              <ScrollView style={styles.dropdownOptions}>
                {/* Render province options here */}
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectProvince('Punjab')}
                >
                  <Text>Punjab</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectProvince('Sindh')}
                >
                  <Text>Sindh</Text>
                </TouchableOpacity>
                {/* Add more options as needed */}
              </ScrollView>
            )}
          </View>
         
        

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={toggleDropdownCity}
            >
              <Text style={styles.dropdownLabel}>City: {selectedCity}</Text>
              <AntIcon
                name={isOpenCity ? 'caretup' : 'caretdown'}
                size={16}
                color="#000000"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
            {isOpenCity && (
              <ScrollView style={styles.dropdownOptions}>
                {/* Render city options here */}
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectCity('City 1')}
                >
                  <Text>City 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectCity('City 2')}
                >
                  <Text>City 2</Text>
                </TouchableOpacity>
                {/* Add more options as needed */}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={toggleDropdowncategory}
            >
              <Text style={styles.dropdownLabel}>Vendor Category: {selectedcategory}</Text>
              <AntIcon
                name={isOpencategory ? 'caretup' : 'caretdown'}
                size={16}
                color="#000000"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
            {isOpencategory && (
              <ScrollView style={styles.dropdownOptions}>
                {/* Render province options here */}
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectcategory('Construction Material Suppliers')}
                >
                  <Text>Construction Material Suppliers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectcategory('Sanitary Suppliers')}
                >
                  <Text>Sanitary Suppliers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectcategory('Architects')}
                >
                  <Text>Architects</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectcategory('Construction Companies')}
                >
                  <Text>Construction Companies</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelectcategory('Electrical Suppliers')}
                >
                  <Text>Electrical Suppliers</Text>
                </TouchableOpacity>
                {/* Add more options as needed */}
              </ScrollView>
            )}
            </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              onBlur={validatePassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
           <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Address"
              onChangeText={(text) => setAddress(text)}
            />
          </View>
          
          <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
            <Text style={styles.imageUploadButtonText}>Upload Profile Picture</Text>
          </TouchableOpacity>
          {profilePicture && (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          )}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginAccountText} onPress={handlesignin}>
            <Text>
              Already have an account? <Text style={styles.loginAccountText2}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250,125,84,255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, // Add some padding to the bottom for better spacing
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
    marginBottom: 20, // Added spacing between fields
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8, // Added spacing between dropdown and next field
  },
  dropdownLabel: {
    color: 'black',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownOptions: {
    maxHeight: 150,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownOption: {
    padding: 12,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  errorText: {
    color: 'red',
  },
  imageUploadButton: {
    backgroundColor: 'rgba(250,125,84,255)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  imageUploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: 'rgba(250,125,84,255)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  registerButtonText: {
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
    color: '#00f',
  },
});

export default Register;
