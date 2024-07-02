import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Text,
    Image,
    Alert,
} from 'react-native';
import { Divider } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthConText } from '@/store/AuthContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

interface CarDetail {
    car_model?: {
        brand: string;
        model: string;
        year: string;
        number_of_seats: number;
    };
    images?: string[];
    total_trip: number;
    status: string;
    motion: string;
    fuel: string;
}

const comments = [
    {
        id: 1,
        author: 'Jane Doe',
        authorAvatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
        text: 'Dịch vụ tốt!',
    },
    {
        id: 2,
        author: 'John Smith',
        authorAvatar: 'https://www.bootdey.com/img/Content/avatar/avatar3.png',
        text: 'Xe chất lượng ok, giá cả hợp lý, MinhHungCar hỗ trợ khách hàng nhiệt tình',
    },
];

export default function DetailScreen() {
    const router = useRouter();
    const { slug } = useLocalSearchParams();

    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    // const [detailCar, setDetailCar] = useState<CarDetail>({CarDetail});
    const [detailCar, setDetailCar] = useState<CarDetail>({
        images: [],
        total_trip: 0,
        status: '',
        fuel: '',
        motion: ''
    });
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getDetailCar();
    }, []);

    const getDetailCar = async () => {
        try {
            const response = await axios.get(`https://minhhungcar.xyz/car/${slug}`);
            setDetailCar(response.data.data);
            console.log('Fetch successfully: ', response.data.message);
            setLoading(false);
        } catch (error: any) {
            if (error.response.data.error_code === 10027) {
                Alert.alert('Lỗi', 'Không thể xem được chi tiết xe lúc này. Vui lòng thử lại sau!');
            } else {
                console.log('Error: ', error.response.data.message);
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingOverlay message="" />
                </View>
            ) : (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.container}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                            <View style={styles.photos}>
                                {Array.isArray(detailCar.images) && detailCar.images.length > 0 ? (
                                    <Swiper
                                        renderPagination={(index, total) => (
                                            <View style={styles.photosPagination}>
                                                <Text style={styles.photosPaginationText}>
                                                    {index + 1} of {total}
                                                </Text>
                                            </View>
                                        )}
                                    >
                                        {detailCar.images.map((src, index) => (
                                            <Image
                                                key={index}
                                                source={{ uri: src }}
                                                style={styles.photosImg}
                                                resizeMode="cover"
                                            />
                                        ))}
                                    </Swiper>
                                ) : (
                                    <Text style={styles.errorText}>Không có hình ảnh xe</Text>
                                )}
                            </View>

                            <View style={styles.info}>
                                <View>
                                    <Text style={styles.infoTitle}>
                                        {detailCar.car_model?.brand + ' ' + detailCar.car_model?.model + ' ' + detailCar.car_model?.year}
                                    </Text>

                                    <View style={styles.infoRating}>

                                        <TabBarIcon name='star' size={26} color="#F3CA52" style={{ marginRight: 5 }} />
                                        <Text style={styles.infoRatingLabel}>5.0</Text>


                                        <TabBarIcon name='history' size={26} color='green' style={{ marginRight: 5, marginLeft: 25 }} />
                                        <Text style={styles.infoRatingLabel}>{detailCar.total_trip} chuyến</Text>
                                    </View>

                                    <View>
                                        {(detailCar.status === 'approved' || detailCar.status === 'active' || detailCar.status === 'waiting_car_delivery') && (
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={styles.button} onPress={() =>
                                                    router.push({ pathname: "/contract", params: { carId: slug } })}>
                                                    <Text style={styles.buttonText}>Xem hợp đồng</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.buttonCancel} onPress={() => { }}>
                                                    <Text style={{ padding: 5, textAlign: 'center', color: 'white' }}>Hủy</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <Divider style={{ marginTop: 20 }} />
                            <View style={styles.character}>
                                <Text style={styles.characterTitle}>Đặc điểm</Text>
                                <View style={styles.characterContent}>
                                    <View style={styles.card}>
                                        {/* <Image source={require('../assets/transmission.png')} style={styles.cardImg} /> */}
                                        <TabBarIcon name='car-shift-pattern' style={styles.cardImg} />
                                        <Text style={styles.cardLabel}>Truyền động</Text>
                                        <Text style={styles.cardContent}>
                                            {detailCar.motion === 'automatic_transmission' ? 'Số tự động' : 'Số sàn'}
                                        </Text>
                                    </View>

                                    <View style={styles.card}>
                                        <TabBarIcon name='seat' style={styles.cardImg} />
                                        <Text style={styles.cardLabel}>Số ghế</Text>
                                        <Text style={styles.cardContent}>{detailCar.car_model?.number_of_seats} chỗ </Text>
                                    </View>

                                    <View style={styles.card}>
                                        <TabBarIcon name='gas-station-outline' style={styles.cardImg} />
                                        <Text style={styles.cardLabel}>Nhiên liệu</Text>
                                        <Text style={styles.cardContent}>
                                            {detailCar.fuel === 'electricity' ? 'Điện' : (detailCar.fuel === 'oil' ? 'Dầu' : 'Xăng')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Divider style={{ marginTop: 20, marginBottom: 5 }} />
                            <View style={styles.comment}>
                                <Text style={styles.commentTitle}>Đánh giá</Text>
                                <View>
                                    {comments.map((item) => (
                                        <View key={item.id.toString()} style={styles.commentContainer}>
                                            <Image source={{ uri: item.authorAvatar }} style={styles.commentAvatar} />
                                            <View style={styles.commentTextContainer}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.commentAuthor}>{item.author}</Text>
                                                    <Text style={styles.commentDate}>19/05/2024</Text>
                                                </View>

                                                <View style={styles.commentRating}>
                                                    <TabBarIcon name='star' color='#F3CA52' style={{ width: 20, height: 20 }} />
                                                    <Text>5</Text>
                                                </View>
                                                <Text style={styles.commentText}>{item.text}</Text>
                                            </View>
                                        </View>
                                    ))}
                                    <TouchableOpacity
                                        style={styles.seeMoreContainer}
                                        onPress={() => {

                                        }}>

                                        <Text style={styles.seeMore}>Xem thêm</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>

                        </ScrollView>
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 0,
        marginHorizontal: 16,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    /** Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '600',
        color: '#000',
    },
    /** Photos */
    photos: {
        marginTop: 12,
        position: 'relative',
        height: 240,
        overflow: 'hidden',
        borderRadius: 12,
    },
    photosPagination: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#000',
        borderRadius: 12,
    },
    photosPaginationText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#fbfbfb',
    },
    photosImg: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        width: '100%',
        height: 240,
    },
    /** Info */
    info: {
        marginTop: 12,
        // backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoTitle: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '600',
        letterSpacing: 0.38,
        color: '#000000',
        marginBottom: 6,
    },
    infoRating: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRatingLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 2,
    },

    /** character */
    character: {
        marginTop: 3,
        // backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginBottom: -15
    },
    characterTitle: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '600',
        letterSpacing: 0.38,
        color: '#000000',
        marginBottom: 6,
    },
    characterContent: {
        paddingVertical: 12,
        paddingHorizontal: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    /** Card */
    card: {
        width: 100,
        paddingVertical: 16,
        paddingHorizontal: 0,
        borderRadius: 12,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 6,
    },
    cardImg: {
        width: 40,
        height: 40,
        marginBottom: 12,
    },
    cardLabel: {
        fontWeight: '600',
        fontSize: 13,
        lineHeight: 18,
        color: '#838383',
    },
    cardContent: {
        fontWeight: '600',
        fontSize: 15,
        lineHeight: 18,
        color: 'black',
        marginTop: 4
    },
    /** comment */
    comment: {
        marginTop: 0,
        paddingVertical: 16,
        paddingHorizontal: 10,
    },
    commentTitle: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '600',
        letterSpacing: 0.38,
        color: '#000000',
        marginBottom: 6,
    },
    commentContainer: {
        flexDirection: 'row',
        padding: 15,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        marginVertical: 8,
        borderRadius: 8,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentTextContainer: {
        flex: 1,
    },
    commentAuthor: {
        fontWeight: 'bold',
        fontSize: 15
    },
    commentDate: {
        color: '#787878',
        marginTop: 2,
        fontSize: 13
    },
    commentRating: {
        marginTop: 5,
        flexDirection: 'row',
    },
    commentText: {
        color: '#333',
        marginTop: 5,
        fontSize: 13
    },
    seeMoreContainer: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1.5,
        borderColor: '#828282',
        marginVertical: 8,
        borderRadius: 5,
        justifyContent: 'center'
    },
    seeMore: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
    },
    /** Button */
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#773BFF',
        borderColor: '#773BFF',
    },
    btnText: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
    button: {
        width: 110,
        height: 30,
        backgroundColor: '#F4BB4C',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    buttonCancel: {
        width: 110,
        height: 30,
        backgroundColor: '#F91010',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        padding: 5,
        textAlign: 'center',
        alignItems: 'center',
        color: 'white'
    },
    errorText: {
        textAlign: 'center',
        justifyContent: 'center'
    }
});