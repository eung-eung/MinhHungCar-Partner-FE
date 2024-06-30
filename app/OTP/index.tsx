import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import OtpInput from '../../components/Auth/OTPinputFields';
import Button from '../../components/Button';
import { verifyOtp } from '../../util/auth';
import { useNavigation } from '@react-navigation/native';
import LoadingOverlay from '../../components/LoadingOverlay';
import { router } from 'expo-router';


interface OTPScreenProps {
    route: {
        params: {
            phone_number: string;
        };
    };
}

const OTPScreen: React.FC<OTPScreenProps> = ({ route }) => {
    const [otp, setOtp] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const { phone_number } = route.params;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOtpValues = (enteredValue: string) => {
        setOtp(enteredValue);
        setDisabled(enteredValue.length !== 6);
    };

    const handleSubmitOTP = async () => {
        if (otp.length !== 6) return;
        try {
            setIsLoading(true);
            await verifyOtp(phone_number, otp);
            Alert.alert('Thành công', 'Tài khoản của bạn đã được xác minh thành công!');
            router.replace('/signIn');
        } catch (error) {
            Alert.alert('OTP không hợp lệ', 'Mã OTP không đúng. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingOverlay message='' />
                </View>
            ) : (
                <View style={styles.outerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Xác minh</Text>
                        <Text style={styles.detail}>MinhHungCar đã gửi mã OTP đến số điện thoại của bạn.</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <OtpInput numberOfInputs={6} onChangeText={handleOtpValues} />
                        <Button disabled={disabled} onPress={handleSubmitOTP}>
                            <Text style={{ color: 'white' }}>Gửi</Text>
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
