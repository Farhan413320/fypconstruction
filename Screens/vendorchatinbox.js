import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EmojiSelector from 'react-native-emoji-selector';
import { useContext } from 'react';
import { useVendorContext } from '../VendorContext';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import ip from "../ipconfig";

const Vendorchatinbo = ({ route}) => {
  const [messageText, setMessageText] = useState('');
  const [userId, setUserId] = useState(null);
  const [vendorid, setvendorid] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [username, setusername] = useState('');
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const { userId: routeUserId } = route.params; 
    setUserId(routeUserId);
   // console.log(routeUserId);
    const fetchMessages = async () => {
      try {
        const nameresponse = await axios.get(`http://${ip}:8000/usernameget/${routeUserId}`);
        setusername(nameresponse.data.userName);
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const vendorId = decodedToken.userId;
        setvendorid(vendorId);

        const response = await axios.get(`http://${ip}:8000/previousmessagesvendor/${vendorId}/${routeUserId}`);
        const formattedMessages = response.data.map(message => ({
          ...message,
          timestamp: formatTimestampToLocal(message.timestamp),
        }));
        setMessages(formattedMessages);
        console.log(userId);

        // Scroll to the bottom after loading messages
        scrollToBottom();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [route.params.userId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestampToLocal = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sendMessage = async () => {
    try {
      if (messageText.trim() === '') {
        return;
      }

      const currentTimestamp = new Date().toISOString();

      const newMessage = {
        id: messages.length + 1,
        message: messageText,
        senderModel: 'Vendor',
        timestamp: formatTimestampToLocal(currentTimestamp),
      };

      // Update the UI with the new message
      setMessages([...messages, newMessage]);
      setMessageText('');
      setSendButtonDisabled(true);

      // Send the message to the backend
      const response = await axios.post(`http://${ip}:8000/send-message`, {
        senderId: vendorid,
        recipientId: userId,
        senderModel: 'Vendor',
        recipientModel: 'User',
        messageType: 'text',
        message: messageText,
        timestamp: currentTimestamp,
      });

      if (response.status === 201) {
       
      } else {
        // Handle any errors here
        console.error('Failed to send message');
      }

      // Scroll to the bottom after sending a message
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleImageSelection = () => {
    // Implement image selection logic here
  };

  const handleMessageInputChange = (text) => {
    setMessageText(text);
    setSendButtonDisabled(text.trim() === '');
  };

  const handleTextInputSubmitEditing = () => {
    if (!sendButtonDisabled) {
      sendMessage();
    }
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const renderItem = ({ item }) => {
    const isUserMessage = item.senderModel === 'User';
    const messageContainerStyle = isUserMessage
      ? styles.userMessageContainer
      : styles.vendorMessageContainer;

    const messageTextStyle = isUserMessage
      ? styles.userMessageText
      : styles.vendorMessageText;

    return (
      <View
        style={[
          styles.messageContainer,
          messageContainerStyle,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            messageTextStyle,
          ]}
        >
          {item.message}
        </Text>
        <View style={styles.messageInfo}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          {isUserMessage && (
            <MaterialIcon name="check" size={16} color="green" />
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F0F0F0' }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: -200 })}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.vendorName}>{username}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        ListEmptyComponent={() => (
          <View style={styles.noMessagesContainer}>
            <Text style={styles.noMessagesText}>You have no chat with.</Text>
          </View>
        )}
        renderItem={renderItem}
      />

      {showEmojiSelector && (
        <View style={styles.emojiSelectorContainer}>
          <EmojiSelector
            onEmojiSelected={(emoji) => {
              handleMessageInputChange(messageText + emoji);
            }}
            columns={8}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={handleImageSelection}>
          <FontAwesomeIcon name="paperclip" size={20} color="#555555" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={handleMessageInputChange}
          multiline={false}
          onSubmitEditing={handleTextInputSubmitEditing}
        />

        <TouchableOpacity style={styles.emojiButton} onPress={handleEmojiPress}>
          <FontAwesomeIcon name="smile-o" size={24} color="#555555" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            sendButtonDisabled ? styles.disabledSendButton : {},
          ]}
          onPress={sendMessage}
          disabled={sendButtonDisabled}
        >
          <MaterialIcon name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 8,
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '70%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  vendorMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    fontSize: 17,
    color: 'black',
  },
  userMessageText: {
    color: 'black',
  },
  vendorMessageText: {
    color: 'black',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMessagesText: {
    fontSize: 15,
    color: 'red',
  },
  attachButton: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 17,
  },
  emojiButton: {
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 20,
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  emojiSelectorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Vendorchatinbo;
