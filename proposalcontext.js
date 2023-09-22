// proposalcontext.js

import React, { createContext, useContext, useState } from 'react';

const ProposalContext = createContext();

export const useProposalContext = () => {
  return useContext(ProposalContext);
};

export const ProposalProvider = ({ children }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);

  const setProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  return (
    <ProposalContext.Provider value={{ selectedProposal, setProposal }}>
      {children}
    </ProposalContext.Provider>
  );
};
