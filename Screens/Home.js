import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ip from "../ipconfig";


const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
     
      <View style={styles.overlay} />
      <View>
      <TouchableOpacity style={styles.drawerIcon}>
        <MaterialIcon name="menu" size={30} color="black" />
      </TouchableOpacity>
        <Image
          source={require('../Public/images/onstruction.png')}
          style={{
            height: 240,
            width: '100%',
            
            marginTop: 10,
          }}
        />
      </View>
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
          <Text style={styles.title}>Cement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('SanitaryWareScreen')}
        >
          <Image
            source={require('../Public/images/sanitary.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Sanitary Ware</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('RMSScreen')}
        >
          <Image
            source={require('../Public/images/rms.png')}
            style={styles.image}
          />
          <Text style={styles.title}>RMS</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ConstructionMaterialScreen')}
        >
          <Image
            source={require('../Public/images/wall.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Construction Material</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('TMTSteelScreen')}
        >
          <Image
            source={require('../Public/images/steel.png')}
            style={styles.image}
          />
          <Text style={styles.title}>TMT Steel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('MarbleTilesScreen')}
        >
          <Image
            source={require('../Public/images/marble.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Marble & Tiles</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('HomeScreen')}>
          <AntIcon name="home" size={30} color="gray" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('chatscreen')}>
          <AntIcon name="message1" size={30} color="gray" />
          <Text style={styles.tabText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('SearchScreen')}>
          <AntIcon name="search1" size={30} color="gray" />
          <Text style={styles.tabText}>Search</Text>
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
    backgroundColor: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 95,
    backgroundColor: '#fff',
    opacity: 0.8,
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
    color: 'gray',
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
