import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SERVER_URL } from '@env';

const RegistrationScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userCode, setUserCode] = useState('');
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
  };

  const registerUser = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.message === "User with this phone number already exists.") {
          Alert.alert("Registration Failed", "This phone number is already registered.");
        } else {
          Alert.alert("Registration Failed", errorData.message || "Something went wrong");
        }
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Registration Failed", errorData.message || "Something went wrong");
        return;
      }

      const data = await response.json();
      setUserCode(data.data.userCode);
      setQrCodeId(data.data.qrCodeId); // Ensure this path matches the backend response structure

      console.log("QR Code ID:", data.data.qrCodeId);

      Alert.alert("Registration Successful", "Your QR Code and User Code have been generated");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to connect to the server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register With Your Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        keyboardType="phone-pad"
      />
      <Button title="Register" onPress={registerUser} />

      {userCode && qrCodeId && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>User Code: {userCode}</Text>
          {qrCodeId ? <QRCode value={qrCodeId} size={150} /> : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    justifyContent: 'center'
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
});

export default RegistrationScreen;
