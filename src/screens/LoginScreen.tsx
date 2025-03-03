import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SERVER_URL } from '@env';

type RootStackParamList = {
    Login: undefined;
    Dashboard: { userCode: string; qrCodeId: string }; //Navigate with user data
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

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Login Failed', data.message);
                return;
            }

            // Store user code and QR Code
            setUserCode(data.data.userCode);
            setQrCodeId(data.data.qrCodeId);

            Alert.alert('Success', "You have successfully logged in");

            // Navigate to Dashboard
            navigation.navigate("Dashboard", { userCode: data.data.userCode, qrCodeId: data.data.qrCodeId });
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
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingHorizontal: 10 },
});

export default LoginScreen;