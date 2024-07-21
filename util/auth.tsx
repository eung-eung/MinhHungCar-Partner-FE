import axios from 'axios';
import { apiAccount } from '@/api/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export async function getUser(phone_number: string, password: string) {
    try {
        const response = await axios.post(apiAccount.login, {
            phone_number: phone_number,
            password: password
        });

        // console.log('Login Response:', response.data);

        // Check if the response is as expected
        if (response.data && response.data.data && response.data.data.access_token) {
            const token = response.data.data.access_token;
            const role = response.data.data.user.role;
            // console.log("tokennn: ", token)
            // console.log("role: ", role)
            if (role === "customer") {
                Alert.alert('Tài khoản này không thể đăng nhập', 'Vui lòng tạo tài khoản mới')
            } else {
                return { token };

            }
        }
    } catch (error: any) {
        if (error.response) {
            if (error.response.data.error_code === 10014) {
                Alert.alert('Sai mật khẩu', 'Vui lòng kiểm tra lại');
            } else if (error.response.data.error_code === 10001) {
                Alert.alert('Đăng nhập thất bại!', 'Tài khoản này chưa được đăng kí');
            } else {
                Alert.alert('Đăng nhập thất bại!', 'Vui lòng kiểm tra lại!');
                console.log('Login Error:', error.response.data.message);
            }

        } else {
            Alert.alert('Đăng nhập thất bại!', 'Vui lòng kiểm tra lại!');
            console.log('Login Error:', error.response.data.message);
        }
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
        if (error.response) {
            if (error.response.data.error_code === 10062) {
                Alert.alert('Tài khoản đã được đăng kí', 'Vui lòng kiểm tra lại');
                console.log('Login Error:', error.response.data.message);

            } else if (error.response.data.error_code === 10010) {
                Alert.alert('Không thể xác thực OTP', 'Vui lòng thử lại sau');
                console.log('Login Error:', error.response.data.message);

            } else if (error.response.data.error_code === 10047) {
                Alert.alert('Không thể gửi OTP', 'Vui lòng thử lại sau');
                console.log('Login Error:', error.response.data.message);

            } else {
                Alert.alert('Đăng kí thất bại!', 'Vui lòng kiểm tra lại!');
                console.log('Login Error:', error.response.data.message);

            }
        } else {
            Alert.alert('Đăng kí thất bại!', 'Vui lòng kiểm tra lại!');
            console.log('Login Error:', error.response.data.message);

        }
    }
}

export async function verifyOtp(phone_number: string, otp: string) {
    try {
        const response = await axios.post(apiAccount.verifyOTP, {
            phone_number,
            otp,
        });

        if (response.status === 200) {
            return response.status;
        } else {
            throw new Error('OTP verification failed');
        }
    } catch (error: any) {
        if (error.response?.data?.error_code === 10012) {
            Alert.alert('OTP không hợp lệ', 'Vui lòng thử lại!');
        } else if (error.response?.data?.error_code === 10010) {
            Alert.alert('Không thể xác thực OTP', 'Vui lòng thử lại sau');
        } else if (error.response?.data?.error_code === 10047) {
            Alert.alert('Không thể gửi OTP', 'Vui lòng thử lại sau');
        } else {
            throw error;
        }
    }
}