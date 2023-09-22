import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ip from "../ipconfig";
const ChatScreen = () => {
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    console.log('Sending message:', messageText);
    // Perform the action of sending the message
    setMessageText('');
  };

  const handleAttachFile = () => {
    console.log('Attach file');
    // Handle attaching a file
  };

  const handleRecordVoice = () => {
    console.log('Record voice');
    // Handle voice recording
  };

  const handleReleaseVoice = () => {
    console.log('Release voice');
    // Handle releasing voice recording
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcon name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.vendorName}>Vendor A</Text>
          <Text style={styles.status}>Online</Text>
        </View>
        <TouchableOpacity style={styles.statusButton}>
          <View style={styles.statusIndicator} />
        </TouchableOpacity>
      </View>

      <View style={styles.messageContainer}>
        {/* Render the list of messages here */}
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={handleAttachFile}>
          <FontAwesomeIcon name="paperclip" size={20} color="#555555" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordButton}
          onPressIn={handleRecordVoice}
          onPressOut={handleReleaseVoice}
        >
          {isRecording ? (
            <MaterialIcon name="mic-off" size={24} color="white" />
          ) : (
            <MaterialIcon name="mic" size={24} color="white" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <MaterialIcon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 125, 84, 220)',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  status: {
    fontSize: 16,
    color: 'white',
  },
  statusButton: {
    marginLeft: 12,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  attachButton: {
    marginRight: 12,
  },
  recordButton: {
    marginRight: 12,
    backgroundColor: 'rgba(250, 125, 84, 220)',
    padding: 8,
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(250, 125, 84, 220)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: 'rgba(250, 125, 84, 220)',
    padding: 12,
    borderRadius: 20,
  },
});

export default ChatScreen;
