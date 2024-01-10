import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,ImageBackground } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import ip from "../ipconfig";
import { ScrollView } from 'react-native-gesture-handler';

const cities = ['lahore', 'islamabad'];
const cementBrands = [
  'Askari Cement',
  'Maple Leaf Cement',
  'Bestway Cement',
  'Fauji Cement',
  'Attock Cement Limited',
  'D.G Khan Cement',
];
const bricksTypes = ['A Grade (awal Bricks)', 'B Grade (Doem Bricks)', 'C Grade (Khangar)'];
const bajriTypes = [
  'Margalla crush bajri',
  'Sargodha crush bajri A+ (2 sutar)',
  'Sargodha crush bajri A (2 sutar)',
];

const allCombinations = [];

for (const city of cities) {
  for (const cementBrand of cementBrands) {
    for (const bricksType of bricksTypes) {
      for (const bajriType of bajriTypes) {
        let pricePerSqFeet;

        if (city === 'lahore') {
          switch (cementBrand) {
            case 'Askari Cement':
              pricePerSqFeet = 1200;
              break;
            case 'Maple Leaf Cement':
              pricePerSqFeet = 1150;
              break;
            case 'Bestway Cement':
              pricePerSqFeet = 1195;
              break;
            case 'Fauji Cement':
              pricePerSqFeet = 1190;
              break;
            case 'Attock Cement Limited':
              pricePerSqFeet = 1175;
              break;
            case 'D.G Khan Cement':
              pricePerSqFeet = 1150;
              break;
            default:
              break;
          }
        } else if (city === 'islamabad') {
          switch (cementBrand) {
            case 'Askari Cement':
              pricePerSqFeet = 1250;
              break;
            case 'Maple Leaf Cement':
              pricePerSqFeet = 1225;
              break;
            case 'Bestway Cement':
              pricePerSqFeet = 1270;
              break;
            case 'Fauji Cement':
              pricePerSqFeet = 1245;
              break;
            case 'Attock Cement Limited':
              pricePerSqFeet = 1225;
              break;
            case 'D.G Khan Cement':
              pricePerSqFeet = 1240;
              break;
            default:
              break;
          }
        }

        allCombinations.push({
          city,
          cementBrand,
          bricksType,
          bajriType,
          pricePerSqFeet,
        });
      }
    }
  }
}
console.log(allCombinations);


const ConstructionCostCalculatorScreen = () => {
  const [city, setCity] = useState('');
  const [houseSize, setHouseSize] = useState('');
  const [coveredArea, setCoveredArea] = useState('');
  const [numFloors, setNumFloors] = useState('');
  const [reportVisible, setReportVisible] = useState(false);
  const [materialType, setMaterialType] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [foundationStructurePrice, setFoundationStructurePrice] = useState(0);
  const [plumbingWorkPrice, setPlumbingWorkPrice] = useState(0);
  const [electricalWorkPrice, setElectricalWorkPrice] = useState(0);
  const [selectedCementBrand, setSelectedCementBrand] = useState('');
  const [selectedBricksType, setSelectedBricksType] = useState('');
  const [selectedBajriType, setSelectedBajriType] = useState('');
  const [selectedSteelType, setSelectedSteelType] = useState('');
 

  const calculateCost = () => {
    if (!city || !houseSize || !coveredArea || coveredArea <= 0 || !numFloors) {
      Alert.alert('Incomplete Form', 'Please fill in all fields.');
      return;
    }
    const selectedCombination = allCombinations.find(
      (combination) =>
        combination.city === city &&
        combination.cementBrand === selectedCementBrand &&
        combination.bricksType === selectedBricksType &&
        combination.bajriType === selectedBajriType
    );
  
    // Set the default pricePerSqFeet to 1200 if the combination is not found
    const pricePerSqFeet = selectedCombination ? selectedCombination.pricePerSqFeet : 1200;

    let totalPrice = pricePerSqFeet * parseFloat(coveredArea);

    let percentage = 0;
    if (numFloors === '2') {
      percentage = 0.07; // 7% of the calculated price
    } else if (numFloors === '3') {
      percentage = 0.14; // 14% of the calculated price
    }

    // Calculate the adjustment based on the number of floors
    totalPrice += percentage * totalPrice; // Calculate the percentage of the total price
    totalPrice *= parseFloat(numFloors); // Multiply total price by the number of floors

    const foundationStructurePercentage = 0.84;
    const plumbingWorkPercentage = 0.12;
    const electricalWorkPercentage = 0.04;

    const foundationStructurePrice = totalPrice * foundationStructurePercentage;
    const plumbingWorkPrice = totalPrice * plumbingWorkPercentage;
    const electricalWorkPrice = totalPrice * electricalWorkPercentage;

    setTotalPrice(totalPrice);
    setFoundationStructurePrice(foundationStructurePrice);
    setPlumbingWorkPrice(plumbingWorkPrice);
    setElectricalWorkPrice(electricalWorkPrice);

    setReportVisible(true);
  };

 
  const closeReport = () => {
   
    setReportVisible(false);
  };

  const toggleCheckbox = (value, setSelectedItem) => {
    setSelectedItem(value);
  };


  return (
   
    <ScrollView style={styles.container}>
        <ImageBackground source={require('../Public/images/logo.png')} style={styles.backgroundImage}>
      <View style={styles.header}>
     
        <Text  style={styles.header}>Construction Cost Calculator</Text>
        
      </View>

      </ImageBackground>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <Picker
            style={styles.picker}
            selectedValue={city}
            onValueChange={(value) => setCity(value)}
          >
            <Picker.Item label="Select City" value="" />
            <Picker.Item label="Lahore" value="lahore" />
            <Picker.Item label="Islamabad" value="islamabad" />
           
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>House Size (Marla)</Text>
          <Picker
            style={styles.picker}
            selectedValue={houseSize}
            onValueChange={(value) => setHouseSize(value)}
          >
            <Picker.Item label="Select Size" value="" />
            <Picker.Item label="5 Marla" value="5" />
            <Picker.Item label="7 Marla" value="7" />
            <Picker.Item label="10 Marla" value="10" />
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Floors</Text>
          <Picker
            style={styles.picker}
            selectedValue={numFloors}
            onValueChange={(value) => setNumFloors(value)}
          >
            <Picker.Item label="Select Number of Floors" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Material Type</Text>

          
          <View style={styles.checkboxContainer}>
            <Text style={styles.label}>Cement Brands</Text>
            {[
              'Askari Cement',
              'Maple Leaf Cement',
              'Bestway Cement',
              'Fauji Cement',
              'Attock Cement Limited',
              'D.G Khan Cement',
            ].map((cementBrand) => (
              <View key={cementBrand} style={styles.checkboxRow}>
                <CheckBox
                  value={selectedCementBrand === cementBrand}
                  onValueChange={() => toggleCheckbox(cementBrand, setSelectedCementBrand)}
                />
                <Text style={styles.checkboxText}>{cementBrand}</Text>
              </View>
            ))}
          </View>

          
          <View style={styles.checkboxContainer}>
            <Text style={styles.label}>Bricks Types</Text>
            {['A Grade (awal Bricks)', 'B Grade (Doem Bricks)', 'C Grade (Khangar)'].map(
              (bricksType) => (
                <View key={bricksType} style={styles.checkboxRow}>
                  <CheckBox
                    value={selectedBricksType === bricksType}
                    onValueChange={() => toggleCheckbox(bricksType, setSelectedBricksType)}
                  />
                  <Text style={styles.checkboxText}>{bricksType}</Text>
                </View>
              )
            )}
          </View>

        
          <View style={styles.checkboxContainer}>
            <Text style={styles.label}>Bajri Types</Text>
            {[
              'Margalla crush bajri',
              'Sargodha crush bajri A+ (2 sutar)',
              'Sargodha crush bajri A (2 sutar)',
            ].map((bajriType) => (
              <View key={bajriType} style={styles.checkboxRow}>
                <CheckBox
                  value={selectedBajriType === bajriType}
                  onValueChange={() => toggleCheckbox(bajriType, setSelectedBajriType)}
                />
                <Text style={styles.checkboxText}>{bajriType}</Text>
              </View>
            ))}
          </View>

        
        </View>
        <TouchableOpacity style={styles.calculateButton} onPress={calculateCost}>
          <Text style={styles.buttonText}>Calculate Cost</Text>
        </TouchableOpacity>
        {reportVisible && (
          <View style={styles.reportContainer}>
            <Text style={styles.reportHeader}>Construction Cost Report</Text>

           

           
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Construction Material Cost:</Text>
             
              <Text style={styles.detailValue}>{foundationStructurePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.detailContainer}>
             
              <Text style={styles.bel}>(Cement,Bricks,Bajri,Steel,Labour Cost included)</Text>
             
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Plumbing Work:</Text>
              <Text style={styles.detailValue}>{plumbingWorkPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Electrical Work:</Text>
              <Text style={styles.detailValue}>{electricalWorkPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Total Grey Structure Cost:</Text>
              <Text style={styles.detailValue}>{totalPrice.toFixed(2)}</Text>
            </View>

           
            <TouchableOpacity style={styles.calculateButton} onPress={closeReport}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 32,
    paddingBottom: 20,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  
    marginVertical: 1,
    width: '100%', 
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 8, 
    fontSize: 15, 
    color: 'black', 
  },
 
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
  },
  formContainer: {
    flex: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 35,
  },
  inputContainer: {
    marginBottom: 20,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  input: {
    paddingHorizontal: 16,
    height: 50,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 18,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  picker: {
    height: 50,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  calculateButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reportContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  reportHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

});

export default ConstructionCostCalculatorScreen;

