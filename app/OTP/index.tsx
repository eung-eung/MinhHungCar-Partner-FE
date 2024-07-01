import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import OtpInput from '../../components/Auth/OTPinputFields';
import Button from '../../components/Button';
import { verifyOtp } from '../../util/auth';
import { useNavigation, RouteProp } from '@react-navigation/native'; // Import RouteProp for type-checking route props
import LoadingOverlay from '../../components/LoadingOverlay';
import { router, useLocalSearchParams } from 'expo-router';

interface OTPScreenProps {
    route: RouteProp<{ params: { phone_number: string; email?: string; password: string; last_name?: string; first_name?: string } }, 'params'>; // Define the route prop type
}

const OTPScreen: React.FC<OTPScreenProps> = ({ route }) => {
    const [otp, setOtp] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const params = useLocalSearchParams();
    const { phone_number, email, password, last_name, first_name } = params;

    const handleOtpValues = (enteredValue: string) => {
        setOtp(enteredValue);
        setDisabled(enteredValue.length !== 6);
    };

    const handleSubmitOTP = async () => {
        if (otp.length !== 6) return;
        try {
            setIsLoading(true);
            await verifyOtp(phone_number, otp);
            Alert.alert('Success', 'Your account has been successfully verified!');
            router.replace('/signIn');
        } catch (error) {
            Alert.alert('Invalid OTP', 'The OTP entered is incorrect. Please try again!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingOverlay message='Verifying OTP...' />
                </View>
            ) : (
                <View style={styles.outerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Xác thực</Text>
                        <Text style={styles.detail}>MinhHungCar đã gửi mã OTP đến số điện thoại của bạn.</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <OtpInput numberOfInputs={6} onChangeText={handleOtpValues} />
                        <Button disabled={disabled} onPress={handleSubmitOTP}>
                            <Text style={{ color: 'white' }}>Submit</Text>
                        </Button>
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    detail: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        color: '#773BFF',
    },
    innerContainer: {
        marginHorizontal: 20,
        flex: 1,
        top: 200,
    },
    button: {
        marginTop: 20,
    },
});

export default OTPScreen;
