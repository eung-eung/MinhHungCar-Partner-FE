import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { AuthConText } from '@/store/AuthContext';
import Swiper from 'react-native-swiper';
import { AntDesign } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { apiContract } from '@/api/apiConfig';

interface Activity {
    id: number;
    car_id: number;
    customer: {
        id: number;
        first_name: string;
        last_name: string;
        avatar_url: string
    };
    car: {
        id: number;
        car_model: {
            brand: string;
            model: string;
            year: number;
        };
        license_plate: string;
        price: number;
        status: string;
    };
    start_date: string;
    end_date: string;
    status: string;
    reason: string;
    rent_price: number;
    insurance_amount: number;
    feedback_rating: number;
    feedback_content: string;
    net_receive: number;

}

interface CarDetail {
    id: number;
    car_model: {
        brand: string;
        model: string;
        year: number;
    };
    license_plate: string;
    rating: number;
    images: string[];
}



const formatDateWithTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear().toString().slice(-2);
    return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const formatNumber = (number: any) => {
    return new Intl.NumberFormat('vi-VN').format(number);
};

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'no_filter':
            return { borderColor: '#F89F36', color: '#F89F36' };
        case 'waiting_partner_approval':
            return { borderColor: '#56AEFF', color: '#56AEFF' };
        case 'waiting_for_agreement':
            return { borderColor: '#A9A9A9', color: '#A9A9A9' };
        case 'waiting_contract_payment':
            return { borderColor: '#6482AD', color: '#6482AD' };
        case 'ordered':
            return { borderColor: '#F4BB4C', color: '#F4BB4C' };
        case 'appraising_car_approved':
            return { borderColor: '#AF47D2', color: '#AF47D2' };
        case 'renting':
            return { borderColor: '#24D02B', color: '#24D02B' };
        case 'returned_car':
            return { borderColor: '#E178C5', color: '#E178C5' };
        case 'appraised_return_car':
            return { borderColor: '#E0A75E', color: '#E0A75E' };
        case 'completed':
            return { borderColor: '#15891A', color: '#15891A' };
        case 'pending_resolve':
            return { borderColor: '#C75B7A', color: '#C75B7A' };
        case 'resolved':
            return { borderColor: '#1679AB', color: '#1679AB' };
        case 'appraising_car_rejected':
            return { borderColor: '#8C6A5D', color: '#8C6A5D' };
        case 'canceled':
            return { borderColor: '#D21312', color: '#D21312' };

        default:
            return { borderColor: 'grey', color: 'grey' };
    }
};

const statusConvert: Record<string, string> = {
    no_filter: 'Tất cả',
    waiting_for_agreement: 'Chờ chấp thuận',
    waiting_contract_payment: 'Chờ thanh toán',
    waiting_partner_approval: 'Chờ xác nhận',
    ordered: 'Đã đặt',
    appraising_car_approved: 'Đủ điều kiện bàn giao',
    renting: 'Đang thuê',
    returned_car: 'Đã trả xe',
    appraised_return_car: 'Hoàn thành kiểm tra',
    completed: 'Hoàn thành',
    pending_resolve: 'Đang xử lí sự cố',
    resolved: 'Đã xử lí sự cố',
    appraising_car_rejected: 'Không đủ điều kiện',
    canceled: 'Đã hủy',
};
export default function ActivityDetailScreen() {
    const params = useLocalSearchParams()
    const { carID, activityID } = params;
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;



    const [loading, setLoading] = useState(true);
    const [activityHistory, setActivityHistory] = useState<Activity[]>([]);
    const [detailActivity, setDetailActivity] = useState<Activity>();
    const [detailCar, setDetailCar] = useState<CarDetail>();
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();



    useEffect(() => {
        getActivity();
        getDetailCar();
    }, [activityID, carID]);

    const getActivity = async () => {
        try {
            const response = await axios.get(`https://minhhungcar.xyz/partner/activity?car_id=${carID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setActivityHistory(response.data.data);
            const detailActivity = response.data.data.find((act: Activity) => act.id === Number(activityID));
            setDetailActivity(detailActivity);
            // console.log("status: ", detailActivity.status)
            setLoading(false);
        } catch (error: any) {
            console.log('Error get Activity history: ', error.response.data.message);
        }
    };

    const getDetailCar = async () => {
        try {
            const response = await axios.get(`https://minhhungcar.xyz/car/${carID}`);
            setDetailCar(response.data.data);
            // console.log('Fetch successfully: ', response.data.message);
        } catch (error: any) {
            if (error.response.data.error_code === 10027) {
                console.log('Error get detail car at history: ', error.response.data.message);
            } else {
                console.log('Error getDetailCar: ', error.response.data.message);
            }
        }
    };
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            getActivity(),
            getDetailCar()
        ]);
        setRefreshing(false);
    }, []);

    //approve/ reject request rent car
    const approveRejectRequest = async (action: string) => {
        try {
            const response = await axios.put(apiContract.approveReject,
                {
                    "customer_contract_id": detailActivity?.id,
                    "action": action
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            // Handle response if needed
            // console.log('Response:', response.data.data.status);

        } catch (error: any) {
            console.log("Error approve/reject request: ", error.response?.data?.message || error.message);
        }
    };

    const handleButtonClick = (action: string) => {
        const message = action === 'approve'
            ? 'Bạn có chắc muốn xác nhận yêu cầu thuê xe này?'
            : 'Bạn có chắc muốn hủy yêu cầu thuê xe này?';

        Alert.alert(
            'Xác nhận',
            message,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',

                },
                {
                    text: 'OK',
                    onPress: async () => {
                        await approveRejectRequest(action);
                        onRefresh();
                    },
                },
            ],
            { cancelable: false }
        );
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    {detailActivity ? (
                        <View style={styles.container}>
                            {/* Info */}
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 15 }}>
                                    {/* <Text style={styles.date}> {formatDateWithTime(new Date(detailActivity.start_date))} → {formatDateWithTime(new Date(detailActivity.end_date))}</Text> */}

                                    {/* <View style={{ borderColor: getStatusStyles(detailActivity.status).borderColor, borderWidth: 1, paddingVertical: 5, paddingHorizontal: 35, borderRadius: 20 }}> */}
                                    <Text style={{ color: getStatusStyles(detailActivity.status).color, fontWeight: 'bold', fontSize: 14 }}>{statusConvert[detailActivity.status]}</Text>
                                    {/* </View> */}
                                </View>
                                <Text style={styles.name}>{`${detailActivity.car.car_model.brand} ${detailActivity.car.car_model.model} ${detailActivity.car.car_model.year}`}</Text>
                                <Text style={styles.plate}>Biển số xe: {detailActivity.car.license_plate}</Text>

                                {/* <Text style={styles.price}>Giá thuê:
                                    <Text style={{ color: '#EF5A6F' }}>  {formatNumber(detailActivity.rent_price)} đ</Text>
                                </Text>
                                <Text style={styles.price}>Thực nhận:
                                    <Text style={{ color: '#EF5A6F' }}> {formatNumber(detailActivity.net_receive)} đ</Text>
                                </Text> */}

                                {/* {(detailActivity.feedback_rating && detailActivity.feedback_content) ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.ratingText}>Đánh giá: </Text>
                                        <TabBarIcon name='star' color='orange' size={24} />
                                        <Text style={styles.ratingText}>{detailActivity.feedback_content}</Text>
                                    </View>
                                    : ""} */}
                                <View style={styles.photos}>
                                    {Array.isArray(detailCar?.images) && detailCar.images.length > 0 ? (
                                        <View style={styles.photos}>
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
                                        </View>
                                    ) : (
                                        <Text style={styles.errorText}>Không có hình ảnh xe</Text>
                                    )}
                                </View>

                                <View style={styles.table}>
                                    {/* Table Header Row */}
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Thời gian nhận xe</Text>
                                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Thời gian trả xe</Text>
                                    </View>

                                    {/* Table Data Row for Dates */}
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{formatDateWithTime(new Date(detailActivity.start_date))}</Text>
                                        <Text style={styles.tableCell}>{formatDateWithTime(new Date(detailActivity.end_date))}</Text>
                                    </View>

                                    {/* Table Header Row for Pricing */}
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Giá thuê</Text>
                                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Giá thực nhận</Text>
                                    </View>

                                    {/* Table Data Row for Pricing */}
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { color: '#EF5A6F', fontWeight: 'bold' }]}>{formatNumber(detailActivity.rent_price)} đ</Text>
                                        <Text style={[styles.tableCell, { color: '#EF5A6F', fontWeight: 'bold' }]}>{formatNumber(detailActivity.net_receive)} đ</Text>
                                    </View>
                                </View>


                            </View>


                            {/* Feedback */}
                            {(detailActivity.feedback_rating && detailActivity.feedback_content) ?
                                <View>
                                    <Divider style={{ marginVertical: 20 }} />

                                    <View style={{ marginTop: 5 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Đánh giá của khách hàng</Text>
                                        <View style={styles.commentContainer}>
                                            {detailActivity.customer.avatar_url && typeof detailActivity.customer.avatar_url === 'string' ? (
                                                <Image source={{ uri: detailActivity.customer.avatar_url }} style={styles.commentAvatar} />
                                            ) : (
                                                <TabBarIcon name='account-circle' size={40} style={{ borderRadius: 20, marginRight: 10 }} />
                                            )}

                                            <View style={styles.commentTextContainer}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.commentAuthor}>{detailActivity.customer.last_name + " " + detailActivity.customer.first_name}</Text>
                                                    {/* <Text style={styles.commentDate}>19/05/2024</Text> */}
                                                </View>

                                                <View style={styles.commentRating}>
                                                    <TabBarIcon name='star' color='orange' size={18} style={{ marginLeft: 3 }} />
                                                    <Text>{detailActivity.feedback_rating}</Text>
                                                </View>
                                                <Text style={styles.commentText}>{detailActivity.feedback_content}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                : ""}
                            {/* Note */}
                            {detailActivity.reason ?
                                <View>
                                    <Divider style={{ marginVertical: 20 }} />
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Ghi chú</Text>
                                        <Text style={styles.noteContent}>Móp đầu xe 10%, hư xi nhan, hư đèn pha</Text>
                                        <Image style={styles.mainImageNote} source={{ uri: 'https://baogiaothong.mediacdn.vn/files/news/2018/04/07/170456-img_8945.jpg' }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Image style={styles.extraImageNote} source={{ uri: 'https://shitekdetailing.com/uploads/images/bai-viet/gia-sua-xe-o-to-bi-mop-bao-nhieu.jpg' }} />
                                            <Image style={styles.extraImageNote} source={{ uri: 'https://thegioiphuongtien.vn/uploaded/files/50b5149712b35373823b20877a917d4d.jpg' }} />
                                            <Image style={styles.extraImageNote} source={{ uri: 'https://danhbongoto.vn/kcfinder/upload/images/Xe-o-to-bi-tray-xuoc-son.jpg' }} />
                                        </View>
                                    </View>
                                </View>
                                : ""}
                        </View>
                    ) : (
                        <View style={styles.emptyChatContainer}>
                            <AntDesign name="inbox" size={50} color="#B4B4B8" />
                            <Text style={styles.emptyChatText}>Chưa có hoạt động nào</Text>
                        </View>
                    )}

                </ScrollView>

            )}
            {detailActivity?.status === 'waiting_partner_approval' ?
                <View style={styles.overlay}>
                    <View style={styles.overlayContent}>
                        <Text style={{ textAlign: 'center', fontWeight: '700' }}>Vui lòng giao xe tới MinhHungCar trước thời gian nhận xe 2 tiếng</Text>
                        <Text style={{ textAlign: 'center', color: 'gray' }}>(Yêu cầu này sẽ tự động bị hủy sau 5 phút nữa)</Text>

                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => handleButtonClick('reject')}>
                            <View style={styles.btnReject}>
                                <Text style={styles.btnTextReject}>Từ chối</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleButtonClick('approve')}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText}>Xác nhận</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                : ""}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    date: {
        color: '#5A5A5A',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 15
    },
    name: {
        textTransform: 'uppercase',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    },
    plate: {
        color: '#757575',
        fontSize: 14,
        marginBottom: 15
    },
    price: {
        color: '#5A5A5A',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 17
    },
    ratingText: {
        color: '#5A5A5A',
        fontSize: 15,
        fontWeight: 'bold'
    },

    /** comment */
    comment: {
        marginTop: 0,
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginBottom: -15
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
        marginVertical: 15,
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
    /* Note */
    noteContent: {
        fontSize: 16,
        marginVertical: 15
    },
    mainImageNote: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 8
    },
    extraImageNote: {
        width: '30%',
        height: 100,
        marginVertical: 15,
        borderRadius: 8
    },
    statusText: {
        fontWeight: 'bold',
        marginBottom: 15,
        padding: 5,
        paddingHorizontal: 10,
        width: 180,
        textAlign: 'center'
    },
    /** Photos */
    photos: {
        marginTop: 2,
        marginBottom: 28,
        position: 'relative',
        height: 160,
        overflow: 'hidden',
        borderRadius: 12,
    },
    photosPagination: {
        position: 'absolute',
        bottom: 25,
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
        height: 160,
    },
    errorText: {
        textAlign: 'center',
        justifyContent: 'center'
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
        marginTop: 10
    },
    //table
    table: {
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
    },
    tableCell: {
        padding: 10,
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#F1F5F9',
        textAlign: 'center',
    },
    tableHeaderCell: {
        backgroundColor: '#F1F5F9',
        fontWeight: 'bold',
    },
    /** Overlay */
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        paddingHorizontal: 24,
        paddingBottom: 45,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    overlayContent: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingBottom: 15
    },
    overlayContentTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 2,
    },

    overlayContentPrice: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#5457FB',
    },
    /** Button */
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Distribute space between buttons
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#773BFF',
        borderColor: '#773BFF',
        marginHorizontal: 8,
        flex: 1,
    },
    btnReject: {
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: '#773BFF',
        marginHorizontal: 8,
        flex: 1,
    },
    btnText: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
    btnTextReject: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '600',
        color: '#773BFF',
    },
});
