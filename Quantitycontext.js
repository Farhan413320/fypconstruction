import React, { createContext, useState, useContext } from 'react';

const QuantityContext = createContext();

export const QuantityProvider = ({ children }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <QuantityContext.Provider value={{ quantity, setQuantity }}>
      {children}
    </QuantityContext.Provider>
  );
};

export const useQuantity = () => {
  return useContext(QuantityContext);
};
