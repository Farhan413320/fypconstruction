import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationContainer } from '@react-navigation/native';


import LoginScreen from './Screens/Login';
import PasswordReset from './Screens/Forgotpass';
import ContractScreen from './Screens/customercontract';
import Home from './Screens/Home';
import Register from './Screens/RegisterasVendor';
import RegisterasCustomer from './Screens/RegisterCust';
import ResetPasswordScreen from './Screens/NewPass';
import OTPVerify from './Screens/EmailVeri';
import CreateProposal from './Screens/CreateRFP';
import CalculateCost from './Screens/ConstructionCost';
import VendorScreen from './Screens/CementScreen';
import Chatinbo from './Screens/chatinbox';
import Chatscreen from './Screens/chatscreen';
import RFPSection from './Screens/proposalscreen';
import ProposalDetailsScreen from './Screens/proposaldetailscreen';
import VendorHomeScreen from './Screens/VendorHome';
import Vendorprofile from './Screens/Vendorprofile';
import Vendororder from './Screens/Vendororder';
import Vendorproposal from './Screens/Vendorproposal';
import Vendorhome2 from './Screens/vendorhome2';
import Vendorbid from './Screens/Vendorbids';
import ChatbotScreen from './Screens/chatbot';
import ProductDet from './Screens/ProductD';
import CheckoutScreen from './Screens/checkout';
import CustomerOrdersScreen from './Screens/customerorders';
import ContractsScreen from './Screens/contractcus';
import Sanitery from './Screens/sanitery';
import ElectricalScreen from './Screens/electrical';
import MarblesScreen from './Screens/Marbles';
import Toolsscreen from './Screens/tools';
import Steel from './Screens/steel';
import NotificationScreen from './Screens/notifcation';

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
  chatinbox: Chatinbo,
  chatscreen: Chatscreen,
  proposalscreen: RFPSection,
  proposaldetailscreen:ProposalDetailsScreen,
  VendorHome:VendorHomeScreen,
  Vendorproposal:Vendorproposal,
  chatbot:ChatbotScreen,
  Vendororder: Vendororder,
  //vendorhome2: Vendorhome2,
  Vendorbids: Vendorbid,
  ProductD:ProductDet,
  checkout:CheckoutScreen,
  customerorders:CustomerOrdersScreen,
  customercontract:ContractScreen,
  contractcus:ContractsScreen ,
  sanitery:Sanitery,
  electrical:ElectricalScreen,
  Marbles:MarblesScreen,
  tools:Toolsscreen,
  steel:Steel,
 notifcation:NotificationScreen,

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
