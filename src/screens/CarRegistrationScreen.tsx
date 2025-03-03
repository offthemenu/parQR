import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SERVER_URL } from '@env';

type RootStackParamList = {
  CarRegistration: { userId: string };
  Dashboard: undefined;
};

type CarRegistrationProps = NativeStackScreenProps<RootStackParamList, "CarRegistration">;

const CarRegistrationScreen: React.FC<CarRegistrationProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [licensePlate, setLicensePlate] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carBrand, setCarBrand] = useState('');

  const handleRegisterCar = async () => {
    if (!licensePlate || !carModel || !carBrand) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/car/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, licensePlate, carModel, carBrand }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Registration Failed', data.message);
        return;
      }

      Alert.alert('Success', 'Car registered successfully');
      navigation.replace('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Your Car</Text>
      <TextInput
        style={styles.input}
        placeholder="License Plate"
        value={licensePlate}
        onChangeText={setLicensePlate}
      />
      <TextInput
        style={styles.input}
        placeholder="Car Model"
        value={carModel}
        onChangeText={setCarModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Car Brand"
        value={carBrand}
        onChangeText={setCarBrand}
      />
      <Button title="Register Car" onPress={handleRegisterCar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingHorizontal: 10 },
});

export default CarRegistrationScreen;
