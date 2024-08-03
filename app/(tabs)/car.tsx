import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Tooltip } from '@rneui/themed';
import axios from 'axios';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { AuthConText } from '@/store/AuthContext';
import { useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { apiAccount, apiPayment } from '@/api/apiConfig';

interface Car {
    id: number;
    status: string;
    images: string[];
    car_model: {
        brand: string;
        model: string;
        based_price: number;
    };
    license_plate: string;
}

const ControlledTooltip: React.FC<any> = (props) => {
    const [open, setOpen] = useState(false);
    return (
        <Tooltip
            visible={open}
            contentStyle={styles.tooltipContent}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            {...props}
        />
    );
};

const statusMessages: Record<string, string> = {
    pending_approval: 'Đăng kí xe thành công, vui lòng chờ MinhHungCar kiểm duyệt',
    approved: 'Xe đã được duyệt thành công. Bạn có thể tiến hành kí hợp đồng',
    rejected: 'Thông tin xe bị từ chối. Vui lòng kiểm tra và đăng kí lại',
    active: 'Xe đang được sử dụng bởi MinhHungCar',
    inactive: 'Xe đã dừng hoạt động. Muốn biết thêm chi tiết vui lòng liên hệ MinhHungCar!',
    waiting_car_delivery: 'Chủ xe phải tới trung tâm để kiểm chứng giấy tờ',
    'pending_application:pending_car_images': 'Đang chờ hoàn thành thông tin ảnh xe',
    'pending_application:pending_car_caveat': 'Đang chờ hoàn thành thông tin giấy tờ xe',
    'pending_application:pending_price': 'Đang chờ hoàn thành thông tin giá cả',
};

const statusConvert: Record<string, string> = {
    no_filter: 'Tất cả',
    pending_approval: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    active: 'Đang hoạt động',
    inactive: 'Dừng hoạt động',
    waiting_car_delivery: 'Đợi giao xe',
    'pending_application:pending_car_images': 'Chưa đăng kí hình ảnh',
    'pending_application:pending_car_caveat': 'Chưa đăng kí giấy tờ xe',
    'pending_application:pending_price': 'Chưa đăng kí thông tin giá cả',
};

const TabConvert: Record<string, string> = {
    no_filter: 'Tất cả',
    pending_approval: 'Chờ duyệt',
    approved: 'Đã duyệt',
    waiting_car_delivery: 'Đợi giao xe',
    rejected: 'Đã từ chối',
    active: 'Đang hoạt động',
    inactive: 'Dừng hoạt động',
    pending_application: 'Đợi hoàn thành thông tin',
};

const getStatusStyles = (status: any) => {
    switch (status) {
        case 'pending_approval':
            return { borderColor: '#F89F36', color: '#F89F36' };
        case 'approved':
            return { borderColor: '#773BFF', color: '#773BFF' };
        case 'rejected':
            return { borderColor: '#FF4040', color: '#FF4040' };
        case 'active':
            return { borderColor: '#53D23E', color: '#53D23E' };
        case 'inactive':
            return { borderColor: '#A91D3A', color: '#A91D3A' };
        case 'waiting_car_delivery':
            return { borderColor: '#56AEFF', color: '#56AEFF' };
        default:
            return { borderColor: 'gray', color: 'gray' };
    }
};

const getStatusDisplay = (status: any) => {
    if (status.startsWith('pending_application:')) {
        return statusConvert[status];
    }
    return statusConvert[status];
};

const MyCar: React.FC = () => {
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;
    const router = useRouter()
    const [registeredCars, setRegisteredCars] = useState<Car[]>([]);
    const [activeTab, setActiveTab] = useState<string>('no_filter');
    const [isLoading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1); // State for pagination

    const [IdNum, setIdNum] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    const [bankNum, setBankNum] = useState<string>('');
    const [bankOwner, setBankOwner] = useState<string>('');
    const [paymentUrl, setPaymentUrl] = useState<string>('');

    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState<boolean>(false);


    useEffect(() => {
        getRegisteredCar();
    }, [activeTab, page, isFocused]);

    useFocusEffect(
        useCallback(() => {
            getRegisteredCar();
        }, [activeTab, page, isFocused])
    );


    // console.log(isFocused);
    // const loadMoreItem = () => {
    //   setPage(page => page + 1)
    // }
    useEffect(() => {
        getProfile();
        getPaymentInfo();
    }, [IdNum, bankNum, bankName, isFocused])


    const getRegisteredCar = async () => {
        // if(!isLoading){}
        setLoading(true);

        try {

            // console.log('PAGE: ', page);
            const response = await axios.get(
                `https://minhhungcar.xyz/partner/cars?offset=${(page - 1) * 2}&limit=100&car_status=${activeTab}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            const newCars = response.data.data.cars;
            if (newCars.length > 0) {
                // setRegisteredCars(cars => ([...cars, ...newCars]))
                setRegisteredCars(newCars)
            }
            setLoading(false)
            setRefreshing(false);

        } catch (error: any) {
            setRefreshing(false);
            if (error.response.data.error_code === 10026) {
                Alert.alert('Lỗi', 'Hiện giờ thể lấy dữ liệu các chiếc xe')
            } else {
                console.log("Error: ", error.response.data.message)
            }
        }
    };

    const onRefresh = () => {
        setRefreshing(true); // Start the refreshing animation
        setPage(1); // Optionally reset the page number
        getRegisteredCar(); // Fetch new data
    };

    const getProfile = async () => {
        try {
            const response = await axios.get(apiAccount.getProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setIdNum(response.data.data.identification_card_number);

            // console.log('Fetch profile successfully ', response.data.message);
            setLoading(false);
        } catch (error: any) {
            if (error.response?.data?.error_code === 10039) {
                Alert.alert('', 'Không thể lấy thông tin tài khoản');
            } else {
                console.log('Error: ', error.response?.data?.message);
            }
        }
    };

    const getPaymentInfo = async () => {
        try {
            const response = await axios.get(apiPayment.getPaymentInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setBankName(response.data.data.bank_name);
            setBankNum(response.data.data.bank_number);
            setBankOwner(response.data.data.bank_owner);
            setPaymentUrl(response.data.data.qr_code_url);

        } catch (error: any) {
            console.log("error fetch paymeny info: ", error.response.data.message)
        }
    }

    const handleAddCar = async () => {
        if (IdNum === "") {
            Alert.alert(
                'Yêu cầu cập nhật',
                'Bạn chưa cập nhật thông tin tài khoản. Tiến hành cập nhật ngay!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push('/profile');
                        },
                    },
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                ]
            );
            return;
        }
        if (!paymentUrl && (!bankNum || !bankName)) {
            Alert.alert(
                'Yêu cầu cập nhật',
                'Bạn chưa cập nhật thông tin thanh toán. Tiến hành cập nhật ngay!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push('/payInfo');
                        },
                    },
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                ]
            );
            return;
        } else {
            router.replace("/addCarInfo")
        }

    }

    const handleTabPress = (tabName: any) => {
        setActiveTab(tabName);
        setPage(1);
        setRegisteredCars([]);
        setLoading(true)
    };



    const navigateToScreen = (car: any) => {
        if (car && car.status === 'pending_application:pending_car_images') {
            router.replace({ pathname: "/addCarPhoto", params: { carId: car.id, based_price: car.car_model?.based_price } });
        } else if (car && car.status === 'pending_application:pending_car_caveat') {
            router.replace({ pathname: "/addRegist", params: { carId: car.id, based_price: car.car_model?.based_price } });
        } else if (car && car.status === 'pending_application:pending_price') {
            router.replace({ pathname: "/rentingFee", params: { carId: car.id, based_price: car.car_model?.based_price } });
        } else if (car) {
            router.push({ pathname: `/detail/${car.id}` });

        }
    };



    const renderItem = ({ item }: { item: Car }) => (
        <TouchableOpacity onPress={() => navigateToScreen(item)}>
            <View style={styles.card}>
                <View style={{ flexDirection: 'row' }}>
                    {item.status === 'pending_application:pending_car_images' ? (
                        <Image
                            resizeMode="cover"
                            source={require('@/assets/images/null_car.png')}
                            style={styles.cardImg}
                        />
                    ) : (
                        <Image
                            resizeMode="cover"
                            source={{ uri: item.images[0] }}
                            style={styles.cardImg}
                        />
                    )}
                    <View style={styles.cardBody}>
                        <Text
                            style={styles.cardTitle}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {`${item.car_model.brand} ${item.car_model.model}`}
                        </Text>
                        <Text style={styles.cardTag}>{`Biển số xe: ${item.license_plate}`}</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.statusContainer, getStatusStyles(item.status)]}>
                                <Text style={{ color: getStatusStyles(item.status).color }}>
                                    {getStatusDisplay(item.status)}
                                </Text>
                            </View>
                            <ControlledTooltip
                                popover={<Text style={styles.tooltipText}>{statusMessages[item.status]}</Text>}
                                containerStyle={styles.tooltipContainer}
                                backgroundColor='#B4B1B1'
                                height={60}
                            >
                                <TabBarIcon name='progress-question' size={24} color='#C7C8CC' style={{ marginLeft: 2 }} />
                            </ControlledTooltip>
                        </View>
                        {(item.status === 'approved' || item.status === 'active' || item.status === 'waiting_car_delivery') && (
                            <TouchableOpacity style={styles.button} onPress={() =>
                                router.push({ pathname: "/contract", params: { carId: item.id } })

                            }>
                                <Text style={styles.buttonText}>Xem hợp đồng</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {

        return isLoading ?
            <View >
                <ActivityIndicator size="large" color="#aaa" />
            </View> : <></>
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View>

                <View style={styles.tabContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                        {Object.keys(TabConvert).map((statusKey) => (
                            <TouchableOpacity
                                key={statusKey}
                                style={[styles.tabItem, activeTab === statusKey && styles.activeTabItem]}
                                onPress={() => handleTabPress(statusKey)}
                            >
                                <Text style={[styles.tabText, activeTab === statusKey && styles.activeTabText]}>
                                    {TabConvert[statusKey]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.listContainer}>
                    {registeredCars.length > 0 && (
                        <>
                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, marginBottom: 60 }}>
                                <TouchableOpacity style={styles.addCar} onPress={() => { router.replace("/addCarInfo") }}>
                                    <TabBarIcon name='plus' size={24} />
                                    <Text style={{ fontWeight: 600 }}>{' '} Thêm xe</Text>
                                </TouchableOpacity>
                            </View>


                            <FlatList
                                data={registeredCars}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={renderFooter}
                                // onEndReached={!isLoading && loadMoreItem}
                                // onEndReachedThreshold={0}
                                contentContainerStyle={styles.listContainer}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                            />
                        </>
                    )}

                    {registeredCars.length === 0 && !isLoading && (
                        <View >
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                <Text style={{ fontSize: 16, color: '#686D76', marginBottom: 20 }}>Chưa có xe nào {statusConvert[activeTab]}</Text>
                                <TouchableOpacity style={styles.addCar} onPress={handleAddCar}>
                                    <TabBarIcon name='plus' size={24} />
                                    <Text style={{ fontWeight: 600 }}>{' '} Thêm xe</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 5,
        paddingBottom: 130,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        width: '100%',
        borderColor: '#E1E1E1',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },
    cardImg: {
        width: 160,
        height: 135,
        borderRadius: 5,
    },
    cardBody: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    cardTag: {
        fontSize: 14,
        color: '#939393',
        marginBottom: 9,
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addCar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#D9D9D9',
        backgroundColor: '#D9D9D9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        height: 40,
        width: 120
    },
    addCarEmpty: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    statusContainer: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },
    statusIcon: {
        marginLeft: 5,
        width: 20,
        height: 20,
    },
    button: {
        marginTop: 10,
        borderColor: '#773BFF',
        backgroundColor: '#773BFF',
        width: 130,
        height: 32,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonText: {
        color: 'white',
    },
    tooltipContainer: {
        height: 'auto',
    },
    tooltipContent: {
        width: '100%',
        height: '100%'
    },
    tooltipText: {
        color: 'white',
        flexWrap: 'wrap',
    },

    //Tab
    tabContainer: {
        height: 60,
        backgroundColor: 'white',
        marginBottom: 8,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
    },
    tabItem: {
        height: 50,
        justifyContent: 'center',
        marginRight: 25,
    },
    activeTabItem: {
        borderBottomColor: '#773BFF',
        borderBottomWidth: 3,
    },
    activeTabText: {
        fontSize: 16,
        color: '#773BFF',
    },
    tabText: {
        fontSize: 16,
        color: 'black',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#C1C1C1',
        borderRadius: 8,
        color: 'black',
        paddingRight: 10,
        backgroundColor: 'white',
        width: 175,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#C1C1C1',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#F0F0F0',
        width: 150,
    },
    placeholder: {
        color: '#8a8a8a',
    },


});
export default MyCar;