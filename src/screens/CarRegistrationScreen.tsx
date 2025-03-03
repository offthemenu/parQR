import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { SERVER_URL } from '@env';

const CarRegistrationScreen: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carBrand, setCarBrand] = useState('');

  const handleLicensePlateChange = (text: string) => setLicensePlate(text);
  const handleCarModelChange = (text: string) => setCarModel(text);
  const handleCarBrandChange = (text: string) => setCarBrand(text);

  const registerCar = async () => {
    if (!licensePlate || !carModel || !carBrand) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/register-car`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: "YOUR_USER_ID",
          licensePlate,
          carModel,
          carBrand,
        }),
      });
    } catch (error) {
      
    }
  }

  return (
    <View>
      <Text>Car Registration Screen</Text>
    </View>
  );
};

export default CarRegistrationScreen;
