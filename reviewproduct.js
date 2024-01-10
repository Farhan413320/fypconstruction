// ReviewProductContext.js
import React, { createContext, useState, useContext } from 'react';

const ReviewProductContext = createContext();

export const ReviewProductProvider = ({ children }) => {
  const [reviewProductDetails, setReviewProductDetails] = useState({
    productName: '',
    totalPayment: 0,
  });

  const updateReviewProductDetails = (newDetails) => {
    setReviewProductDetails((prevDetails) => ({
      ...prevDetails,
      ...newDetails,
    }));
  };

  return (
    <ReviewProductContext.Provider value={{ reviewProductDetails, updateReviewProductDetails }}>
      {children}
    </ReviewProductContext.Provider>
  );
};

export const useReviewProduct = () => {
  return useContext(ReviewProductContext);
};
