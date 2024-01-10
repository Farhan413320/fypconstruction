import React from 'react';
import { View, Text } from 'react-native';
import AppNav from './appNavigated';
import { UserContext } from "./UserContext";
import { ProposalProvider } from './proposalcontext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VendorProvider } from './VendorContext';
//import { AuthProvider} from './Authvendor';
import { ProductProvider } from './ProductContext';
import { QuantityProvider } from './Quantitycontext';
import {ReviewProductProvider} from './reviewproduct';
Icon.loadFont();

const App = () => {
  return (
    
    <>
   {/* // <AuthProvider> */}
   <ReviewProductProvider>
   <QuantityProvider>
   <ProductProvider>
      <VendorProvider>
      <UserContext>
        <ProposalProvider>
         <AppNav />
         </ProposalProvider>
      </UserContext>
      </VendorProvider>
      </ProductProvider>
      </QuantityProvider>
      </ReviewProductProvider>
     {/* // </AuthProvider> */}
    
    </>
  
  );
};

export default App;
