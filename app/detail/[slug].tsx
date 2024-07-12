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
    rating: number;
    license_plate: string;
}

interface Feedback {
    id: number;
    customer_id: number;
    customer: {
        first_name: string;
        last_name: string;
        avatar_url: string
    };
    car_id: number;
    feedback_content: string;
    feedback_rating: string;
    created_at: string
}

function formatDate(dateString: string) {
    // Parse the date string
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getUTCFullYear();

    // Format the date as day/month/year
    return `${day}/${month}/${year}`;
}

const getStatusStyles = (status: any) => {
    switch (status) {
        case 'pending_approval':
            return { borderColor: '#F89F36', color: '#F89F36', borderRadius: 15, borderWidth: 1 };
        case 'approved':
            return { borderColor: '#773BFF', color: '#773BFF', borderRadius: 15, borderWidth: 1 };
        case 'rejected':
            return { borderColor: '#FF4040', color: '#FF4040', borderRadius: 15, borderWidth: 1 };
        case 'active':
            return { borderColor: '#53D23E', color: '#53D23E', borderRadius: 15, borderWidth: 1 };
        case 'waiting_car_delivery':
            return { borderColor: '#56AEFF', color: '#56AEFF', borderRadius: 15, borderWidth: 1 };
        default:
            return { borderColor: 'gray', color: 'gray', borderRadius: 15, borderWidth: 1 };
    }
};

const statusConvert: Record<string, string> = {
    no_filter: 'Tất cả',
    pending_approval: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    active: 'Đang hoạt động',
    waiting_car_delivery: 'Đợi giao xe',
    'pending_application:pending_car_images': 'Chưa đăng kí hình ảnh',
    'pending_application:pending_car_caveat': 'Chưa đăng kí giấy tờ xe',
    'pending_application:pending_price': 'Chưa đăng kí thông tin giá cả',
};

export default function DetailScreen() {
    const router = useRouter();
    const { slug } = useLocalSearchParams();

    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    // const [detailCar, setDetailCar] = useState<CarDetail>({CarDetail});
    const [detailCar, setDetailCar] = useState<CarDetail | undefined>(undefined);
    const [isLoading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    const [offset, setOffset] = useState(0);
    const limit = 20; // Adjust the limit as needed
    const [hasMoreFeedbacks, setHasMoreFeedbacks] = useState(true);

    useEffect(() => {
        getDetailCar();
        getFeedbackByCar();
    }, [slug]);

    const getDetailCar = async () => {
        try {
            const response = await axios.get(`https://minhhungcar.xyz/car/${slug}`);
            setDetailCar(response.data.data);
            // setStatus(response.data.data.status)
            // console.log("status detail: ", response.data.data.status)
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

    //get feeback by car
    const getFeedbackByCar = async (newOffset = offset) => {
        try {
            const response = await axios.get(`https://minhhungcar.xyz/partner/feedbacks/car?car_id=${slug}&offset=${newOffset}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.data.feedbacks.length < limit) {
                setHasMoreFeedbacks(false); // No more feedbacks to load
            }

            setFeedbacks((prevFeedbacks) => [
                ...prevFeedbacks,
                ...response.data.data.feedbacks
            ]);
            console.log(feedbacks)
            setOffset(newOffset + limit);

        } catch (error: any) {
            if (error.response.data.error_code === 10078) {
                Alert.alert('', 'Tạm thời không thể xem được đánh giá!');
                console.log('Error get feedback: ', error.response.data.message);
            } else {
                Alert.alert('', 'Có vài lỗi xảy ra. Vui lòng thử lại sau!');
                console.log("Error getDetail: ", error.response.data.message);
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
                        {detailCar ? (
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
                                            <Text style={styles.infoRatingLabel}>{detailCar.rating}</Text>


                                            <TabBarIcon name='history' size={26} color='green' style={{ marginRight: 5, marginLeft: 25 }} />
                                            <Text style={styles.infoRatingLabel}>{detailCar.total_trip} chuyến</Text>
                                        </View>


                                        <View >
                                            <Text style={[styles.statusText, getStatusStyles(detailCar?.status)]}>
                                                {statusConvert[detailCar?.status]}
                                            </Text>
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

                                <View>
                                    {feedbacks.length > 0 && (
                                        <>
                                            <Divider style={{ marginTop: 12, marginBottom: 22 }} />
                                            <Text style={styles.commentTitle}>Đánh giá</Text>
                                        </>
                                    )}
                                    {feedbacks.map((item) => (
                                        (item.feedback_content && item.feedback_rating) && (
                                            <View key={item.id.toString()} style={styles.comment}>
                                                <View style={styles.commentContainer}>
                                                    {item.customer.avatar_url ?
                                                        <Image source={{ uri: item.customer.avatar_url }} style={styles.commentAvatar} />
                                                        :
                                                        <TabBarIcon name='account-circle' size={40} style={styles.commentAvatar} />
                                                    }
                                                    <View style={styles.commentTextContainer}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={styles.commentAuthor}>{item.customer.first_name + ' ' + item.customer.last_name}</Text>
                                                            <Text style={styles.commentDate}>{formatDate(item.created_at)}</Text>
                                                        </View>
                                                        <View style={styles.commentRating}>
                                                            <TabBarIcon name='star' size={19} color='#F4CE14' style={{ marginRight: 3 }} />
                                                            <Text>{item.feedback_rating}</Text>
                                                        </View>
                                                        <Text style={styles.commentText}>{item.feedback_content}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    ))}
                                    {hasMoreFeedbacks && (
                                        <TouchableOpacity
                                            style={styles.seeMoreContainer}
                                            onPress={() => getFeedbackByCar(offset)}
                                        >
                                            <Text style={styles.seeMore}>Xem thêm</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>


                            </ScrollView>
                        ) : (
                            <Text style={{ color: '#B4B4B8', textAlign: 'center', marginTop: 100 }}>No data available</Text>
                        )}
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
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center'
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
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
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
    },
    statusText: {
        fontWeight: 'bold',
        marginBottom: 15,
        padding: 5,
        paddingHorizontal: 10,
        width: 180,
        textAlign: 'center'
    },

});