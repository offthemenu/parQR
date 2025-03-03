import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SERVER_URL } from '@env';

//Define navigation types
type RootStackParamList = {
  Registration: undefined;
  Login: undefined;
};

type RegistrationScreenProps = NativeStackScreenProps<RootStackParamList, 'Registration'>;

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userCode, setUserCode] = useState('');
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Registration Failed', errorData.message || "Something went wront");
        return;
      }

      const data = await response.json();
      setUserCode(data.data.userCode);
      setQrCodeId(data.data.qrCodeId);
      Alert.alert('Success', "Your QR Code and User Code have been generated");

      navigation.navigate("Login");
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 20 },
});

export default RegistrationScreen;