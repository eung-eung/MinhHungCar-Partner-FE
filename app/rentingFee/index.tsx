import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCar } from '@/api/apiConfig';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { AuthConText } from '@/store/AuthContext';

interface RentingFeeScreenParams {
    carId?: number;
    based_price?: number;
}

const RentingFeeScreen: React.FC = () => {
    const route = useRouter();
    const params = useLocalSearchParams();
    const { carId, based_price } = params;
    const authCtx = useContext(AuthConText);
    const token = authCtx?.access_token;

    const basedPriceNumber = based_price ? Number(based_price) : 0;
    const carIdNumber = carId ? Number(carId) : 0;

    const [sliderValue, setSliderValue] = useState<number>(basedPriceNumber);
    const [isPriceUpdated, setIsPriceUpdated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSliderValue(basedPriceNumber);
    }, [basedPriceNumber]);

    const handleUpdatePrice = async () => {
        setLoading(true);
        try {
            const response = await axios.put(apiCar.updatePrice, {
                car_id: carIdNumber,
                new_price: sliderValue
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log('Price updated:', response.data.data);
            setIsPriceUpdated(true);
            route.replace("/success");
        } catch (error: any) {
            const errorMsg = error.response?.data?.error_code === 10058
                ? 'Không thể cập nhật giá ngay lúc này'
                : error.response?.data?.message || 'Error updating price';
            Alert.alert('Lỗi', errorMsg);
            setLoading(false);
            console.log('Error: ', error.response.data.message)
        }
    };

    if (based_price === undefined) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <LoadingOverlay message="" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                {/* Tab */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItemActive}>
                            <View style={styles.tabItemIcon}>
                                <TabBarIcon name='clipboard-list-outline' color='#773BFF' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabText}>Thông tin xe</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIcon}>
                                <TabBarIcon name='file-image-outline' color='#773BFF' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabText}>Hình ảnh</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIcon}>
                                <TabBarIcon name='file-document-multiple-outline' color='#773BFF' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabText}>Giấy tờ xe</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIconActive}>
                                <TabBarIcon name='currency-usd' color='white' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabTextActive}>Giá cho thuê</Text>
                        </View>
                    </View>
                </View>

                {/* Generate fee */}
                <View style={styles.generateContainer}>
                    <Text style={styles.description}>
                        Mức giá thuê đề xuất cho mẫu xe này là{' '}
                        <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {basedPriceNumber.toLocaleString()} VNĐ/ ngày
                        </Text>
                    </Text>
                    <View style={{ marginVertical: 30, flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={styles.price}>{sliderValue.toLocaleString()} VND</Text>
                        <Divider style={{ height: 1, backgroundColor: '#773BFF', width: 180, marginTop: 5 }} />
                    </View>
                    <View style={styles.priceRange}>
                        <Text style={styles.priceRangeText}>
                            {(100000).toLocaleString()} VND
                        </Text>
                        <Text style={styles.priceRangeText}>{(basedPriceNumber).toLocaleString()} VND</Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <LinearGradient
                            colors={['#DACAFF', '#9D71FF', '#8154E8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={styles.gradient}
                        />
                        <Slider
                            style={styles.slider}
                            minimumValue={100000}
                            maximumValue={basedPriceNumber}
                            step={1000}
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            thumbTintColor="#773BFF"
                        />
                    </View>
                    <View style={styles.priceRangeLabel}>
                        <Text style={styles.priceRangeText}>Giá thấp nhất</Text>
                        <Text style={styles.priceRangeText}>Giá cao nhất</Text>
                    </View>
                    <View style={styles.action}>
                        <TouchableOpacity onPress={handleUpdatePrice} disabled={loading || isPriceUpdated}>
                            <View style={[styles.btn, (loading || isPriceUpdated) && styles.btnDisabled]}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.btnText}>Tiếp tục</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 25,
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    /* Tab */
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabItemActive: {
        alignItems: 'center',
    },
    tabItemIconActive: {
        width: 47,
        height: 47,
        borderRadius: 50,
        backgroundColor: '#773BFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabItemIcon: {
        width: 47,
        height: 47,
        borderRadius: 50,
        borderColor: '#773BFF',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabImage: {
        width: 26,
        height: 28,
    },
    tabTextActive: {
        color: '#773BFF',
        fontWeight: 'bold',
        marginVertical: 10,
        fontSize: 12,
    },
    tabText: {
        marginVertical: 10,
        fontSize: 12,
    },
    divider: {
        height: 1,
        width: 24,
        marginBottom: 30,
        marginHorizontal: 5,
    },
    tabItem: {
        alignItems: 'center',
    },
    /* Generate fee */
    generateContainer: {
        marginVertical: 40,
        marginHorizontal: 15
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
        color: 'black',
    },
    sliderContainer: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 5,
        borderRadius: 5,
    },
    slider: {
        width: '100%',
        height: 60,
    },
    thumb: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#6c63ff',
        borderWidth: 2,
        borderColor: '#fff',
    },
    track: {
        height: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    price: {
        fontSize: 24,
        color: '#773BFF',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    priceRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: 14,
        color: '#666',
    },
    priceRangeLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    priceRangeText: {
        fontWeight: '600'
    },
    /* Button */
    action: {
        marginTop: 100
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#773BFF',
        borderColor: '#773BFF',
        borderWidth: 1,
        paddingVertical: 10,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
});


export default RentingFeeScreen;
