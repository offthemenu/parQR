import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SERVER_URL } from '@env';

type RootStackParamList = {
    Login: undefined;
    Dashboard: { userCode: string; qrCodeId: string };
    CarRegistration: { userId: string };
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userCode, setUserCode] = useState<string | null>(null);
    const [qrCodeId, setQrCodeId] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!phoneNumber) {
            Alert.alert("Error", "Please enter a phone number");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Login Failed', errorData.message || 'Something went wrong');
                return;
            }

            const data = await response.json();

            // Store user code and QR Code
            setUserCode(data.data.userCode);
            setQrCodeId(data.data.qrCodeId);

            const carResponse = await fetch(`${SERVER_URL}/api/get-user-cars?userId=${data.data.userId}`);
            if (!carResponse.ok) {
                Alert.alert('Error', 'Unable to fetch user cars.');
                return;
            }

            const carData = await carResponse.json();

            if (!carData.success) {
                Alert.alert("Error", "Unable to check registered cars.");
                return;
              }

            if (carData.cars && carData.cars.length === 0) {
                navigation.replace("CarRegistration", { userId: data.data.userId });
            } else {
                navigation.replace("Dashboard", { userCode: data.data.userCode, qrCodeId: data.data.qrCodeId });
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to connect to the server.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingHorizontal: 10 },
});

export default LoginScreen;