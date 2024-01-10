// ProductContext.js
import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const useProductContext = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const setProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <ProductContext.Provider value={{ selectedProduct, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
