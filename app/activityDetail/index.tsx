import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useLocalSearchParams } from 'expo-router';

export default function ActivityDetailScreen() {
    const params = useLocalSearchParams()
    const { licensePlate, carName, startDate, endDate, feebackRating, feebackContent, rentPrice, customerName, avatarUrl } = params
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={styles.container}>
                    {/* Info */}
                    <View>
                        <Text style={styles.date}>{startDate} → {endDate}</Text>
                        <Text style={styles.name}>{carName}</Text>
                        <Text style={styles.plate}>Biển số xe: {licensePlate}</Text>
                        <Text style={styles.price}>Giá thuê: {rentPrice?.toLocaleString()} đ</Text>
                        <Text style={styles.price}>Thực nhận: 680.000 đ</Text>
                        {(feebackRating && feebackContent) ?
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.ratingText}>Đánh giá: </Text>
                                <TabBarIcon name='star' color='orange' size={24} />
                                <Text style={styles.ratingText}>{feebackRating}</Text>
                            </View>
                            : ""}
                    </View>

                    <Divider style={{ marginVertical: 20 }} />

                    {/* Feedback */}
                    {(feebackRating && feebackContent) ?
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Đánh giá của khách hàng</Text>
                            <View style={styles.commentContainer}>
                                {avatarUrl && typeof avatarUrl === 'string' ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.commentAvatar} />
                                ) : (
                                    <TabBarIcon name='account-circle' size={40} style={{ borderRadius: 20, marginRight: 10 }} />
                                )}

                                <View style={styles.commentTextContainer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.commentAuthor}>{customerName}</Text>
                                        {/* <Text style={styles.commentDate}>19/05/2024</Text> */}
                                    </View>

                                    <View style={styles.commentRating}>
                                        <TabBarIcon name='star' color='orange' size={18} style={{ marginLeft: 3 }} />
                                        <Text>5</Text>
                                    </View>
                                    <Text style={styles.commentText}>{feebackContent}</Text>
                                </View>
                            </View>
                        </View>
                        : ""}
                    {/* Note */}
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30
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
    }
});
