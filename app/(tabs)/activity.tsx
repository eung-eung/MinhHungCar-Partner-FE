import LoadingOverlay from '@/components/LoadingOverlay';
import { AuthConText } from '@/store/AuthContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

interface Car {
    id: number;
    status: string;
    images: string[];
    car_model: {
        brand: string;
        model: string;
        year: number;
        based_price: number;
    };
    license_plate: string;
}



const getStatusColor = (status: string) => {
    switch (status) {
        case 'Đang thuê':
            return '#24D02B';
        case 'Đã đặt':
            return '#F4BB4C';
        case 'Trong kho':
            return '#909090';
        default:
            return '#000000';
    }
};

const ActivityScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Tất cả');
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;
    const router = useRouter()
    const [registeredCars, setRegisteredCars] = useState<Car[]>([]);

    const [isLoading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1); // State for pagination

    const isFocused = useIsFocused();


    const handleTabPress = (tabName: string) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        getRegisteredCar();
    }, [activeTab, page, isFocused]);

    useFocusEffect(
        useCallback(() => {
            getRegisteredCar();
        }, [activeTab, page, isFocused])
    );

    const getRegisteredCar = async () => {
        // if(!isLoading){}
        setLoading(true);

        try {
            // console.log('PAGE: ', page);
            const response = await axios.get(
                `https://minhhungcar.xyz/partner/cars?offset=${(page - 1) * 2}&limit=100`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            const newCars = response.data.data.cars;
            const filteredCars = newCars.filter((car: Car) => car.status !== 'rejected');
            if (filteredCars.length > 0) {
                setRegisteredCars(filteredCars)
            }
            setLoading(false)
        } catch (error: any) {
            if (error.response.data.error_code === 10026) {
                Alert.alert('Lỗi', 'Hiện giờ thể lấy dữ liệu các chiếc xe')
            } else {
                console.log("Error: ", error.response.data.message)
            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <LoadingOverlay message='' />
                    </View>
                ) : (
                    <ScrollView>
                        <View style={styles.container}>
                            {/* Tab */}
                            {/* <View style={styles.tabContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                                {['Tất cả', 'Đang thuê', 'Đã đặt', 'Trong kho'].map((tab, index) => (
                                    <TouchableOpacity key={index} onPress={() => handleTabPress(tab)} style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}>
                                        <Text style={[styles.tabText, activeTab === tab && { color: '#773BFF', fontWeight: '600' }]}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View> */}

                            {/* Card */}
                            <View style={{ marginTop: 15 }}>
                                {registeredCars.length > 0 ?
                                    <>
                                        {registeredCars.map((car, index) => (
                                            <View key={index} style={styles.card}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image
                                                        resizeMode="cover"
                                                        source={{ uri: car.images[0] }}
                                                        style={styles.cardImg}
                                                    />
                                                    <View style={styles.cardBody}>
                                                        <Text style={styles.cardTag}>Biển số xe: {car.license_plate}</Text>
                                                        <Text style={styles.cardTitle}>{car.car_model.brand + ' ' + car.car_model.model + ' ' + car.car_model.year}</Text>
                                                        <View style={styles.cardRow}>
                                                            <View style={styles.cardRowItem}>
                                                                {/* <Text style={{ color: getStatusColor(car.status), fontWeight: '600', fontSize: 15 }}>{car.status}</Text> */}
                                                            </View>
                                                            <TouchableOpacity
                                                                style={{ width: 80, height: 30, backgroundColor: '#773BFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                                                                onPress={() => { router.push({ pathname: '/history', params: { carID: car.id } }) }}
                                                            >
                                                                <Text style={{ color: 'white', fontSize: 14 }}>Lịch sử</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                    :
                                    <View style={styles.emptyChatContainer}>
                                        <Text style={styles.emptyChatText}>Chưa có hoạt động nào</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 25,
        height: 'auto',
    },
    cardImg: {
        width: 150,
        height: 'auto',
        borderRadius: 12,
    },
    cardBody: {
        flex: 1,
        paddingLeft: 14,
        paddingVertical: 5,
    },
    cardTag: {
        fontSize: 13,
        color: '#939393',
        marginBottom: 9,
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 20,
        color: '#000',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    cardRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabContainer: {
        height: 60,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    scrollViewContent: {
        paddingHorizontal: 30,
    },
    tabItem: {
        height: 60,
        justifyContent: 'center',
        marginRight: 30,
    },
    activeTabItem: {
        borderBottomColor: '#773BFF',
        borderBottomWidth: 3,
    },
    tabText: {
        fontSize: 16,
        color: 'black',
    },
    emptyChatContainer: {
        flex: 1,
        marginTop: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyChatText: {
        fontSize: 16,
        color: '#696969',
    },
});

export default ActivityScreen;
