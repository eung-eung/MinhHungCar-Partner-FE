import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

interface HistoryItem {
    month: string;
    date: string;
    status: string;
    price: number;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const placeholder: Item = {
        label: 'Tất cả các xe',
        value: '1',
        color: 'black',
    };
    const total: number = 10000000;

    const barData = [
        { value: 230, label: 'Jan', frontColor: '#4ABFF4' },
        { value: 180, label: 'Feb', frontColor: '#79C3DB' },
        { value: 195, label: 'Mar', frontColor: '#28B2B3' },
        { value: 250, label: 'Apr', frontColor: '#4ADDBA' },
        { value: 320, label: 'May', frontColor: '#91E3E3' },
        { value: 230, label: 'Jun', frontColor: '#4ABFF4' },
        { value: 180, label: 'Jul', frontColor: '#79C3DB' },
        { value: 195, label: 'Aug', frontColor: '#28B2B3' },
        { value: 250, label: 'Sep', frontColor: '#4ADDBA' },
        { value: 320, label: 'Oct', frontColor: '#91E3E3' },
    ];

    const historyData: HistoryItem[] = [
        { month: 'Tháng 5', date: '10/05/2024', status: 'Đã thanh toán', price: 1400000 },
        { month: 'Tháng 4', date: '10/04/2024', status: 'Đã thanh toán', price: 1560000 },
        { month: 'Tháng 3', date: '10/03/2024', status: 'Chưa thanh toán', price: 240000 },
        { month: 'Tháng 2', date: '10/02/2024', status: 'Đã thanh toán', price: 450000 },
        { month: 'Tháng 1', date: '10/01/2024', status: 'Đã thanh toán', price: 520000 }
    ];

    const getStatusStyle = (status: string) => {
        return status === 'Đã thanh toán' ? { borderColor: 'green', color: 'green' } : { borderColor: 'orange', color: 'orange' };
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ paddingHorizontal: 24, marginTop: 20 }}>
                {/* <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedValue(value)}
                        placeholder={placeholder}
                        items={[
                            { label: 'Xe Toyota', value: '2' },
                            { label: 'Xe Ford', value: '3' },
                            { label: 'Xe Audi', value: '4' },
                        ]}
                        style={pickerSelectStyles}
                        Icon={() => <TabBarIcon name="chevron-down" size={24} color="black" style={styles.icon} />}
                    />

                </View> */}
                <View style={styles.totalAvenue}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Tổng thu nhập các tháng</Text>
                    <Text style={{ fontSize: 16 }}>{total.toLocaleString()}</Text>
                </View>
                <View style={styles.barChart}>
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', margin: 20, textAlign: 'center' }}>
                        Theo tháng
                    </Text>
                    <BarChart
                        showFractionalValues  // Corrected prop name
                        showYAxisIndices
                        noOfSections={4}
                        maxValue={400}
                        data={barData}
                        isAnimated
                    />
                </View>

                <View style={styles.historyList}>
                    <Text style={{ color: '#858585', fontWeight: '600', fontSize: 18, marginVertical: 10, marginTop: 15 }}>LỊCH SỬ</Text>
                    {historyData.map((item, index) => (
                        <View key={index} style={styles.historyItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.month}</Text>
                                <View style={[{ width: 113, height: 21, borderWidth: 1, borderRadius: 10, justifyContent: 'center' }, getStatusStyle(item.status)]}>
                                    <Text style={[{ textAlign: 'center' }, { color: getStatusStyle(item.status).color }]}>{item.status}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 16, color: '#858585' }}>{item.date}</Text>
                                <Text style={{ fontWeight: 'bold', color: '#333333', fontSize: 15 }}>{item.price.toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>
                    ))}
                </View>
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
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    selectedValue: {
        marginTop: 20,
        fontSize: 16,
    },
    icon: {
        marginRight: 24,
        marginTop: 14,

    },
    historyList: {
        marginVertical: 10
    },
    historyItem: {
        marginVertical: 15
    },
    select: {
        marginBottom: 12
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 19,
        borderWidth: 1,
        borderColor: '#C1C1C1',
        borderRadius: 16,
        width: 335,
        height: 51,
        marginBottom: 12
    },
    inputAndroid: {
        fontSize: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 19,
        borderWidth: 1,
        borderColor: '#C1C1C1',
        borderRadius: 16,
        width: 335,
        height: 51,
        marginBottom: 12
    },
});

export default HomeScreen;
