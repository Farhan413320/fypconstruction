import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './Screens/Login';
import PasswordReset from './Screens/Forgotpass';
import Home from './Screens/Home';
import Register from './Screens/RegisterasVendor';
import RegisterasCustomer from './Screens/RegisterCust';
import ResetPasswordScreen from './Screens/NewPass';
import OTPVerify from './Screens/EmailVeri';
import CreateProposal from './Screens/CreateRFP';
import CalculateCost from './Screens/ConstructionCost';
import VendorScreen from './Screens/CementScreen';
import ChatScreen from './Screens/chatinbox';
import Chatscreen from './Screens/chatscreen';
import RFPSection from './Screens/proposalscreen';
import ProposalDetailsScreen from './Screens/proposaldetailscreen';
import VendorHomeScreen from './Screens/VendorHome';

const StackNavigator = createStackNavigator({
  Login: LoginScreen,
  Home: Home,
  Forgotpass: PasswordReset,
  RegisterasVendor: Register,
  RegisterCust: RegisterasCustomer,
  NewPass: ResetPasswordScreen,
  EmailVeri: OTPVerify,
  CreateRFP: CreateProposal,
  ConstructionCost: CalculateCost,
  CementScreen: VendorScreen,
  chatinbox: ChatScreen,
  chatscreen: Chatscreen,
  proposalscreen: RFPSection,
  proposaldetailscreen:ProposalDetailsScreen,
  VendorHome:VendorHomeScreen
},
{
  defaultNavigationOptions: {
    headerShown: false, // Hide the header for all screens
  },
});


const AppContainer = createAppContainer(StackNavigator);

const AppNav = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    </View>
  );
};

export default AppNav;
