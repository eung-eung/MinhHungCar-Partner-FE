
import axios from 'axios';
import { apiAccount } from '@/api/apiConfig';
// import axios from '../lib/axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export async function getUser(email: any, password: any) {
    try {
        const response = await axios.post(apiAccount.login, {
            email: email,
            password: password
        });
        const token = response.data.access_token;

        await AsyncStorage.setItem('token', token);

        return token;
    } catch (error) {
        Alert.alert("Đăng nhập thất bại!", "Vui lòng kiểm tra lại!");

    }
}

export async function sendOtpToUser(email: any, password: any, first_name: any, last_name: any, phone_number: any) {
    try {
        const response = await axios.post(apiAccount.registerPartner, {
            first_name,
            last_name,
            phone_number,
            email,
            password
        });
        return response.status;
    } catch (error: any) {
        if (error.response?.status === 400) {
            Alert.alert('Đăng kí thất bại', 'Tài khoản này đã có người đăng kí');
        } else {
            Alert.alert('Lỗi đăng kí', error.response?.data || 'Vui lòng thử lại');
        }
    }
}

export async function verifyOtp(email: any, otp: any) {
    try {
        const response = await axios.post(apiAccount.verifyOTP, {
            email,
            otp
        });
        return response.status;
    } catch (error) {
        Alert.alert('OTP không hợp lệ', 'Vui lòng thử lại!');
    }
}