import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useProposalContext } from "../proposalcontext.js";
import ip from "../ipconfig";

const ProposalDetailsScreen = ({ navigation }) => {
  const { selectedProposal } = useProposalContext();
 // const { bids } = selectedProposal; // Assuming the proposal object has a 'bids' property with an array of bids

  const handleDelete = () => {
    // Implement logic to delete the proposal here
    // After deletion, you can navigate back to the previous screen or a different screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title: {selectedProposal.title}</Text>
      <Text style={styles.description}>Description: {selectedProposal.description}</Text>

      
      {/* <Text style={styles.bidsTitle}>Bids:</Text>
      <FlatList
        data={bids}
        keyExtractor={(item) => item.id.toString()} // Assuming each bid has a unique 'id' property
        renderItem={({ item }) => (
          <View style={styles.bidItem}>
            <Text style={styles.bidText}>Vendor: {item.vendorName}</Text>
            <Text style={styles.bidText}>Amount: ${item.amount}</Text>
           
          </View>
        )}
      /> */}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Proposal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0', // Background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  bidsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  bidItem: {
    backgroundColor: '#fff', // Bid item background color
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  bidText: {
    fontSize: 16,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'red', // Delete button background color
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProposalDetailsScreen;
