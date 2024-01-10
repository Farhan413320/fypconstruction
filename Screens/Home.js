import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ip from "../ipconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Draggable from 'react-native-draggable';

const Home = ({navigation}) => {
  const [chatbotPosition, setChatbotPosition] = useState({ x: 30, y: 650 });

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
  };

  const handlenotif = () => {
    
    navigation.navigate('notifcation');
  };

  return (
    <View style={styles.container}>
      
     
       
         <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity  onPress={handlenotif}>
          <MaterialIcon name="notifications" size={30} color="black" />
        </TouchableOpacity>
        
      
      </View>
     
     <View style={styles.overlay} />
     
      
      
      
      
        <Image
          source={require('../Public/images/onstruction.png')}
          style={{
            height: 240,
            width: '100%',
            
            marginTop: 10,
          }}
        />
      
      
      <View>
        <Text style={styles.title}>Shop by category</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('CementScreen')}
        >
          <Image
            source={require('../Public/images/cement.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Construction Material</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('sanitery')}
        >
          <Image
            source={require('../Public/images/sanitary.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Sanitary Ware</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('tools')}
        >
          <Image
            source={require('../Public/images/rms.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Construction Tools</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('electrical')}
        >
          <Image
            source={require('../Public/images/eee.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>Electrical</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('steel')}
        >
          <Image
            source={require('../Public/images/steel.png')}
            style={styles.image}
          />
          <Text style={styles.title}>TMT Steel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Marbles')}
        >
          <Image
            source={require('../Public/images/marble.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Marble & Tiles</Text>
        </TouchableOpacity>
        
      </View>
      <Draggable
        x={chatbotPosition.x}
        y={chatbotPosition.y}
        renderSize={60}
        isCircle
        renderText="Chat"
        pressDrag={() => {}}
        longPress={() => {}}
        onShortPressRelease={() => navigation.navigate('chatbot')}
      >
        <TouchableOpacity style={styles.chatbotButton} onPress={() => navigation.navigate('chatbot')}>
          <Image source={require('../Public/images/chatt.png')} style={styles.chatbotIcon} />
        </TouchableOpacity>
      </Draggable>
     
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('contractcus')}>
          <AntIcon name="home" size={30} color="gray" />
          <Text style={styles.tabText}>contracts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('chatscreen')}>
          <AntIcon name="message1" size={30} color="gray" />
          <Text style={styles.tabText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('customerorders')}>
          <AntIcon name="shoppingcart" size={30} color="gray" />
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('proposalscreen')} >
          <MaterialIcon name="request-quote" size={30} color="gray" />
          <Text style={styles.tabText}>RFP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('ConstructionCost')}>
          <MaterialIcon name="calculate" size={30} color="gray" />
          <Text style={styles.tabText}>C.Cost</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: 'white',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  overlay: {
   // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 95,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor:'white',
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize:17,
  },
  // logoutContainer: {
  //   position: 'absolute',
  //   right: 20,
  //   top: 20,
  //   zIndex: 1, // Place the logout button above other elements
  // },
  // logoutButton: {
  //   padding: 10,
    
  //   backgroundColor: 'white',
  //   borderRadius: 8,
  // },
  // logoutText: {
  //   color: 'black',
  //   fontWeight: 'bold',
  // },
  chatbotButton: {
    padding: 10,
  },
  chatbotIcon: {
    width: 60,
    height: 60,
    
    // Add any styling for the chatbot icon
  },
  navigationBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 8,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  item: {
    marginTop: 5,
    flex: 1,
    alignItems: 'center',
  },
  image: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
});

export default Home;
