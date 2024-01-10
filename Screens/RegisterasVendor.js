
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
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import ip from "../ipconfig";
import { Picker } from '@react-native-picker/picker';

import AntIcon from 'react-native-vector-icons/AntDesign';

const Register = ({navigation}) => {
  
  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isOpencategory, setIsOpencategory] = useState(false);
  const [selectedcategory, setSelectedcategory] = useState('');
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setcnic] = useState('');
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
    if (!username || !email || !password || !confirmPassword || !name || !phoneNumber || !address || !selectedProvince || !selectedCity || !selectedcategory) {
      Alert.alert("All Fields Required", "Please fill in all the required fields.");
      return;
    }
    if (!name || name.length > 20 || !/^[a-zA-Z\s]+$/.test(name)) {
      Alert.alert('Invalid Name', 'Please enter a valid first name (up to 14 characters, no numbers allowed).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }


    
    if (!phoneNumber || phoneNumber.length > 11 || !/^[0-9]+$/.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number (up to 11 digits).');
      return;
    }

    // Validation for CNIC (assuming CNIC should be in the format "12345-1234567-1")
    // if (!cnic || !/^[0-9]{5}-[0-9]{7}-[0-9]$/.test(cnic)) {
    //   Alert.alert('Invalid CNIC', 'Please enter a valid CNIC.');
    //   return;
    // }

    

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password === '') {
      setPasswordError('Password is required');
      return;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'

        );
        return;
    } 
    if (password !== confirmPassword) {
      
      
      setPasswordMatchError("Password did not matched.");
      return;
    }
    
    const registrationData = {
      username,
      email,
      password,
      name,
      phoneNumber,
      address,
      cnic,
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
              placeholder="CNIC"
              onChangeText={(text) => setcnic(text)}
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
        <Picker
          selectedValue={selectedProvince}
          style={styles.dropdownPicker}
          onValueChange={(itemValue) => setSelectedProvince(itemValue)}
        >
          <Picker.Item label="Select Province" value="" />
          <Picker.Item label="Punjab" value="Punjab" />
          <Picker.Item label="Sindh" value="Sindh" />
          {/* Add more items as needed */}
        </Picker>
      </View>
         
        
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedCity}
          style={styles.dropdownPicker}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
        >
          <Picker.Item label="Select City" value="" />
          <Picker.Item label="Islamabad" value="Islamabad" />
          <Picker.Item label="Rawalpindi" value="Rawalpindi" />
          {/* Add more items as needed */}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedcategory}
          style={styles.dropdownPicker}
          onValueChange={(itemValue) => setSelectedcategory(itemValue)}
        >
          <Picker.Item label="Select Vendor Category" value="" />
          <Picker.Item label="Construction Material Suppliers" value="Construction Material Suppliers" />
          <Picker.Item label="Sanitary Suppliers" value="Sanitary Suppliers" />
          <Picker.Item label="Architects" value="Architects" />
          <Picker.Item label="Contractors" value="Contractors" />
          <Picker.Item label="Electrical Suppliers" value="Electrical Suppliers" />
          <Picker.Item label="Marbles & Tiles" value="Marbles & Tiles" />
          <Picker.Item label="Construction Tools" value="Construction Tools" />
          
        </Picker>
      </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
            
            />
             <View style={styles.iconContainer}>
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <Icon
        name={showPassword ? 'eye' : 'eye-slash'}
        size={20}
        color="gray"
      />
    </TouchableOpacity>
  </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
           <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
             <View style={styles.iconContainer}>
    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
      <Icon
        name={showConfirmPassword ? 'eye' : 'eye-slash'}
        size={20}
        color="gray"
      />
    </TouchableOpacity>
  </View>
  {passwordMatchError !== '' && (
    <Text style={styles.errorText}>{passwordMatchError}</Text>
  )}
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
          
          {/* <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
            <Text style={styles.imageUploadButtonText}>Upload Profile Picture</Text>
          </TouchableOpacity>
          {profilePicture && (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          )} */}
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
    backgroundColor: 'black',
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
  iconContainer: {
    position: 'absolute',
    right: 10, // Adjust the distance from the right side as needed
    top: 12, // Adjust the vertical alignment as needed
  },
  dropdownPicker: {
    height: 40,
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10, 
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
    fontSize:16,
    paddingHorizontal: 12,
    marginBottom: 10,
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
    padding: 10,
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
    backgroundColor: 'black',
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
    backgroundColor: 'black',
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
