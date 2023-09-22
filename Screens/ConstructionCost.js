import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ip from "../ipconfig";



const ConstructionCostCalculatorScreen = () => {
  const [city, setCity] = useState('');
  const [coveredArea, setCoveredArea] = useState('');
  const [reportVisible, setReportVisible] = useState(false);

  const calculateCost = () => {
    if (!city || !coveredArea) {
      Alert.alert('Incomplete Form', 'Please select a city and enter the covered area.');
      return;
    }

    // Calculate the construction cost based on the selected city and covered area
    // ...
    
    // Show the report
    setReportVisible(true);
  };

  const downloadReport = () => {
    // Download the construction cost report
    // ...
    
    // Close the report
    setReportVisible(false);
  };

  const closeReport = () => {
    // Close the report
    setReportVisible(false);
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
      <Text style={styles.headerText}>Construction Cost Calculator</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>City</Text>
        <Picker
          style={styles.picker}
          selectedValue={city}
          onValueChange={(value) => setCity(value)}
        >
          <Picker.Item label="Select City" value="" />
          <Picker.Item label="Islamabad" value="city1" />
          
          {/* Add more cities as needed */}
        </Picker>
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>Covered Area (sq ft)</Text>
        <TextInput
          style={styles.input}
          onChangeText={setCoveredArea}
          value={coveredArea}
          keyboardType="numeric"
        />
       </View>
        <TouchableOpacity style={styles.calculateButton} onPress={calculateCost}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {reportVisible && (
          <View style={styles.reportContainer}>
            <Text style={styles.reportHeader}>Construction Cost Report</Text>
            {/* Display the construction cost report */}
            {/* Include labor cost, material cost, cement cost, and other relevant information */}
            {/* Provide download and close options */}
            <TouchableOpacity style={styles.calculateButton} onPress={downloadReport}>
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.calculateButton} onPress={closeReport}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
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
      header: {
        flex: 1,
        justifyContent: 'center',
      },
      headerText: {
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
        //borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 6,
        paddingHorizontal: 12,
      },
      input: {
    
        paddingHorizontal: 12,
        height: 60,
        borderColor: '#CCCCCC',
        borderBottomWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,    
      },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    marginBottom: 7,
        height: 60,
        borderColor: '#CCCCCC',
        borderBottomWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
  },
 
  
  calculateButton: {
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
  reportContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  reportHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
 
});

export default ConstructionCostCalculatorScreen;

