import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import { apiCar } from '@/api/apiConfig';
import { AuthConText } from '@/store/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

interface FormImage {
    field: string;
    uri: string;
}

export default function AddCarRegistrationScreen() {
    const route = useRouter();
    const params = useLocalSearchParams()
    const { carId, based_price } = params
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    const [form, setForm] = useState({
        images: [
            { field: 'licenseFront', uri: '' },
            { field: 'licenseBack', uri: '' },
        ] as FormImage[],
    });
    const [loading, setLoading] = useState(false);

    const pickImageFromLibrary = async (field: string) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const updatedImages = form.images.map((image) =>
                image.field === field ? { ...image, uri: result.assets[0].uri } : image
            );
            setForm({ ...form, images: updatedImages });
        }
    };

    const handleUpload = async () => {
        const { images } = form;
        if (images.some(image => !image.uri)) {
            Alert.alert('Lỗi', 'Vui lòng thêm đầy đủ hình ảnh');
            return;
        }

        setLoading(true);

        const formData = new FormData() as any;
        formData.append('car_id', carId);
        images.forEach((image, index) => {
            formData.append('files', {
                uri: image.uri,
                name: `${image.field}.jpg`,
                type: 'image/jpeg',
            });
        });
        formData.append('document_category', 'CAR_CAVEAT');

        try {
            const response = await axios.post(apiCar.uploadCarDoc, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Caveat uploaded:', response.data.message);
            route.replace({ pathname: "/rentingFee", params: { carId, based_price } });
        } catch (error: any) {
            console.log('Error uploading caveat:', error.response?.data?.error_code);
            if (error.response?.data?.error_code === 10023) {
                Alert.alert('Lỗi', 'Có một vài lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại');
            } else if (error.response?.data?.error_code === 10024) {
                Alert.alert('Lỗi', 'Hình ảnh kích thước quá lớn. Vui lòng chọn hình ảnh khác!');
            } else {
                Alert.alert('Lỗi', 'Có một vài lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại');
            }
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView style={styles.container}>
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
                                {/* <Image style={styles.tabImage} source={require('../assets/image_purple.png')} /> */}
                                <TabBarIcon name='file-image-outline' color='#773BFF' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabText}>Hình ảnh</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIconActive}>
                                {/* <Image style={styles.tabImage} source={require('../assets/vehicle_regsister_purple.png')} /> */}
                                <TabBarIcon name='file-document-multiple-outline' color='white' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabTextActive}>Giấy tờ xe</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIcon}>
                                {/* <Image style={styles.tabImage} source={require('../assets/dollar_purple.png')} /> */}
                                <TabBarIcon name='currency-usd' color='#773BFF' style={styles.tabImage} />

                            </View>
                            <Text style={styles.tabText}>Giá cho thuê</Text>
                        </View>
                    </View>
                </View>

                {/* Upload image */}
                <View style={styles.imageContainer}>
                    {form.images.map((image) => (
                        <View key={image.field} style={styles.mainImage}>
                            <TouchableOpacity
                                style={styles.licenseUploadButton}
                                onPress={() => pickImageFromLibrary(image.field)}
                            >
                                {image.uri ? (
                                    <Image style={styles.licensePhoto} source={{ uri: image.uri }} />
                                ) : (
                                    // <Image style={styles.licensePhotoPlaceholder} source={require('../../assets/images/splash.png')} />
                                    <TabBarIcon name='folder-multiple-image' size={60} />
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.action}>
                    <TouchableOpacity onPress={handleUpload} disabled={loading || form.images.filter(image => image.uri).length < 2}>
                        <View style={[styles.btn, (loading || form.images.filter(image => image.uri).length < 2) && styles.btnDisabled]}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.btnText}>Tiếp tục</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        paddingHorizontal: 20,
        paddingBottom: 50,
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
        alignItems: 'center',
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
    /* Upload image */
    imageContainer: {
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 10,
        marginBottom: 20,
    },
    licenseUploadButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    licensePhoto: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    licensePhotoPlaceholder: {
        width: 60,
        height: 60,
    },
    /* Button */
    action: {
        marginHorizontal: 16,
        paddingBottom: 40,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#5548E2',
        borderColor: '#5548E2',
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
});