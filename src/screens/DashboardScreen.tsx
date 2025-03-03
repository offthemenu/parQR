import React from "react";
import { View, Text, StyleSheet} from "react-native";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from "../navigation/AppNavigator";

type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = ({ route }: { route: DashboardScreenRouteProp }) => {
    const { userCode, qrCodeId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Dashboard</Text>
            <Text>User Code: {userCode}</Text>
            <Text>QR Code ID: {qrCodeId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignContent: "center" },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20,},
});

export default DashboardScreen;