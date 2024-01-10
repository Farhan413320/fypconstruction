import { createContext, useContext, useState } from 'react';


const VendorContext = createContext();

export const useVendorContext = () => {
  return useContext(VendorContext);
};
export const VendorProvider = ({ children }) => {
  const [vendorId, setVendorId] = useState("");

  const setVendId = (vendorid) => {
    setVendorId(vendorid);
  };
  

  return (
    <VendorContext.Provider value={{ vendorId, setVendId }}>
      {children}
    </VendorContext.Provider>
  );
};

