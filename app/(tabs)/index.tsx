import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import axios from 'axios';
import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { apiAccount, apiAvenue, apiPayment } from '@/api/apiConfig';
import { AuthConText } from '@/store/AuthContext';
import AreaChart from '@/components/AreaChart';
import { useRouter } from 'expo-router';

interface Payment {
    id: number;
    partner_id: number;
    start_date: string;
    end_date: string;
    amount: number;
    payment_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const statusConvert: Record<string, string> = {
    paid: 'Đã thanh toán',
    pending: 'Chưa thanh toán',
};

const formatDateICT = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Bangkok',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};



interface BarDataItem {
    onPress: () => void;
    topLabelComponent?: () => React.ReactNode;
    value: number;
    label: string;
    frontColor: string;
}

const HomeScreen: React.FC = () => {
    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [payments1, setPayments1] = useState<Payment>();
    const [totalAvenue, setTotalAvenue] = useState<number>(0);
    const isFocused = useIsFocused();

    const authContext = useContext(AuthConText);
    const token = authContext.access_token;
    const router = useRouter()

    useEffect(() => {
        if (token) {
            fetchAndValidateUserInfo();
        }
    }, []);

    const fetchAndValidateUserInfo = async () => {
        try {
            // Fetch profile information
            const profileResponse = await axios.get(apiAccount.getProfile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            ;

            // Fetch payment information
            const paymentResponse = await axios.get(apiPayment.getPaymentInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });


            // Validate information and prompt user if necessary
            if (profileResponse.data.data.identification_card_number === "" ||
                (!paymentResponse.data.data.qr_code_url && !paymentResponse.data.data.bank_name)) {
                Alert.alert(
                    'Yêu cầu cập nhật',
                    'Vui lòng cập nhật đầy đủ thông tin tài khoản, giấy phép lái xe và thông tin thanh toán!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                router.push('/setting');
                            },
                        },
                        {
                            text: 'Để sau',
                            style: 'cancel',
                        },
                    ]
                );
            }

        } catch (error: any) {
            if (error.response?.data?.error_code === 10039) {
                Alert.alert('', 'Không thể lấy thông tin tài khoản');
            } else {
                console.log('Error: ', error.response?.data?.message);
            }
        }
    };

    const getAvenue = async () => {
        try {
            const response = await axios.get('https://minhhungcar.xyz/partner/revenue', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = response.data.data;
            const receivedPayments: Payment[] = responseData['payments:'] || [];

            setPayments(receivedPayments);
            setTotalAvenue(responseData.total_revenue || 0);

            console.log('Get avenue successfully: ', response.data.message);
            console.log('Received payments:', receivedPayments);
            console.log('API response:', responseData);
        } catch (error: any) {
            console.log('Error getting avenue: ', error.response?.data?.message);
            setPayments([]);
            setTotalAvenue(0);
        }
    };

    useEffect(() => {
        getAvenue();
    }, [isFocused]);

    const handleBarPress = (index: number) => {
        setSelectedBarIndex(index);
    };

    // Generate bar data based on all months and populate with payment data
    const allMonths = Array.from({ length: 12 }, (_, index) => (index + 1).toString()); // Array of month numbers as strings

    const barData: BarDataItem[] = allMonths.map((month) => {
        const payment = payments.find(p => (new Date(p.start_date).getMonth() + 1).toString() === month);

        return {
            value: payment ? payment.amount : 0,
            label: month,
            frontColor: '#4ABFF4',
            onPress: () => {
                const index = payments.findIndex(p => (new Date(p.start_date).getMonth() + 1).toString() === month);
                handleBarPress(index);
            },
            topLabelComponent: payment ? () => (
                <Text style={styles.barValueText}>{payment.amount.toLocaleString()}</Text>
            ) : undefined,
        };
    });


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ paddingHorizontal: 24, marginTop: 20 }}>
                {payments.length > 0 ?
                    <>
                        <View style={styles.totalAvenue}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Tổng thu nhập các tháng</Text>
                            <Text style={{ fontSize: 16 }}>{totalAvenue.toLocaleString()}</Text>
                        </View>
                        <View style={styles.barChart}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', margin: 20, textAlign: 'center' }}>
                                Theo tháng
                            </Text>
                            <Text style={{ color: 'gray', fontSize: 12, textAlign: 'right' }}>
                                Tỉ lệ: 1:10000
                            </Text>
                            {/* <BarChart
                                // showFractionalValues
                                // showYAxisIndices
                                hideRules
                                noOfSections={5}
                                maxValue={totalAvenue > 0 ? totalAvenue : 1}// Adjust maxValue dynamically
                                data={barData}
                            // isAnimated
                            /> */}
                            <AreaChart ptData={payments} />
                        </View>
                        <View style={styles.historyList}>
                            <Text style={{ color: '#858585', fontWeight: '600', fontSize: 18, marginVertical: 10, marginTop: 15 }}>LỊCH SỬ</Text>

                            {payments.map((item, index) => (
                                <View key={index} style={styles.historyItem}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tháng {new Date(item.start_date).getMonth() + 1}</Text>
                                        <View style={[{ width: 113, height: 21, borderWidth: 1, borderRadius: 10, justifyContent: 'center' }, item.status === 'paid' ? { borderColor: 'green' } : { borderColor: 'orange' }]}>
                                            <Text style={[{ textAlign: 'center' }, item.status === 'paid' ? { color: 'green' } : { color: 'orange' }]}>{statusConvert[item.status]}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 16, color: '#858585' }}>{formatDateICT(item.created_at)}</Text>
                                        <Text style={{ fontWeight: 'bold', color: '#333333', fontSize: 15 }}>{item.amount.toLocaleString('vi-VN')} VNĐ</Text>
                                    </View>
                                </View>
                            ))}

                        </View>
                    </> :
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="history" size={40} color="#B4B4B8" />
                        <Text style={styles.emptyMessage}>Hiện tại chưa có lịch sử thu nhập nào</Text>
                    </View>}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    barChart: {
        marginTop: 20
    },
    totalAvenue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 19,
        borderWidth: 1,
        borderColor: '#F4F4F4',
        backgroundColor: '#F4F4F4',
        borderRadius: 16,
        width: 335,
        height: 51
    },
    barValueText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginTop: -10,
    },
    historyList: {
        marginTop: 20,
    },
    historyItem: {
        marginVertical: 15

    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 250,
    },
    emptyMessage: {
        marginTop: 20,
        fontSize: 16,
        color: '#B4B4B8',
    }
});

export default HomeScreen;
