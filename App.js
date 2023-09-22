import React from 'react';
import { View, Text } from 'react-native';
import AppNav from './appNavigated';
import { UserContext } from "./UserContext";
import { ProposalProvider } from './proposalcontext';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

const App = () => {
  return (
    
    <>
      
      <UserContext>
        <ProposalProvider>
         <AppNav />
         </ProposalProvider>
      </UserContext>
    
    </>
  
  );
};

export default App;
