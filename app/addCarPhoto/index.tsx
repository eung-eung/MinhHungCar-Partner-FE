import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthConText } from '@/store/AuthContext';
import { apiCar } from '@/api/apiConfig';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

interface ImageState {
    selectedImage: string | null;
    imageURL: string | null;
}

const AddCarPhotoScreen: React.FC = () => {
    const route = useRouter();
    const params = useLocalSearchParams();
    const { carId, based_price } = params;
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    const [mainImages, setMainImages] = useState<ImageState>({
        selectedImage: null,
        imageURL: null,
    });
    const [smallImages, setSmallImages] = useState<string[] | null>(['', '', '', '']);
    const [isUploading, setIsUploading] = useState(false);

    const placeholderImages = [
        require('../../assets/images/front.jpg'),
        require('../../assets/images/back.jpg'),
        require('../../assets/images/left.jpg'),
        require('../../assets/images/right.jpg'),
    ];

    const pickImage = async (isMainImage: boolean, index: number | null = null) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            if (isMainImage) {
                setMainImages({
                    selectedImage: imageUri,
                    imageURL: null,
                });
            } else if (index !== null) {
                const newSmallImages = [...smallImages!];
                newSmallImages[index] = imageUri;
                setSmallImages(newSmallImages);
            }
        }
    };

    const handleUpload = async () => {
        if (!mainImages.selectedImage || smallImages!.some((image) => image === null)) {
            Alert.alert('Lỗi', 'Vui lòng chọn tất cả các hình ảnh.');
            return;
        }

        setIsUploading(true);

        const formData = new FormData() as any;
        formData.append('car_id', carId);
        formData.append('document_category', 'CAR_IMAGES');

        try {
            // Append main image
            formData.append('files', {
                uri: mainImages.selectedImage,
                name: 'mainImage.jpg',
                type: 'image/jpeg',
            });

            // Append small images
            smallImages!.forEach((image, index) => {
                if (image) {
                    formData.append('files', {
                        uri: image,
                        name: `smallImage${index + 1}.jpg`,
                        type: 'image/jpeg',
                    });
                }
            });

            const response = await axios.post(apiCar.uploadCarDoc, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            route.push({ pathname: "/addRegist", params: { carId: carId, based_price: based_price } });
            console.log('Images uploaded:', response.data.message);

        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error_code === 10023) {
                Alert.alert('Lỗi', 'Có một vài lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại');
            } else if (error.response && error.response.data && error.response.data.error_code === 10024) {
                Alert.alert('Lỗi', 'Hình ảnh kích thước quá lớn. Vui lòng chọn hình ảnh khác!');
            } else if (error.response && error.response.data && error.response.data.message) {
                Alert.alert('Lỗi', error.response.data.message);
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình xử lý yêu cầu.');
            }
        } finally {
            setIsUploading(false);
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
                            <Text style={styles.tabTextActive}>Thông tin xe</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIconActive}>
                                {/* <Image style={styles.tabImage} source={require('../assets/image_purple.png')} /> */}
                                <TabBarIcon name='file-image-outline' color='white' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabText}>Hình ảnh</Text>
                        </View>
                        <Divider style={styles.divider} />
                    </View>

                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItem}>
                            <View style={styles.tabItemIcon}>
                                {/* <Image style={styles.tabImage} source={require('../assets/vehicle_regsister_purple.png')} /> */}
                                <TabBarIcon name='file-document-multiple-outline' color='#773BFF' style={styles.tabImage} />
                            </View>
                            <Text style={styles.tabText}>Giấy tờ xe</Text>
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
                    {/* Upload main image */}
                    <TouchableOpacity style={styles.mainImage} onPress={() => pickImage(true)}>
                        {mainImages.selectedImage ? (
                            <Image key={mainImages.selectedImage} style={styles.mainImage} source={{ uri: mainImages.selectedImage }} />
                        ) : mainImages.imageURL ? (
                            <Image style={styles.mainImage} source={{ uri: mainImages.imageURL }} />
                        ) : (
                            <Image
                                style={styles.mainImage}
                                source={require('../../assets/images/main.jpg')}
                            />
                        )}
                    </TouchableOpacity>

                    {/* Upload 4 extra images */}
                    <View style={styles.extraImageContainer}>
                        {smallImages!.map((image, index) => (
                            <TouchableOpacity key={index} style={styles.smallImage} onPress={() => pickImage(false, index)}>
                                {image ? (
                                    <Image style={styles.smallImage} source={{ uri: image }} />
                                ) : (
                                    <Image style={styles.smallImage} source={placeholderImages[index]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.action}>
                    <TouchableOpacity onPress={!isUploading ? handleUpload : undefined} disabled={isUploading}>
                        <View style={[styles.btn, ((!mainImages.selectedImage || smallImages!.some((image) => image === null)) || isUploading) && styles.btnDisabled]}>
                            {isUploading ? (
                                <ActivityIndicator size="small" color="#FFF" />
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
        paddingBottom: 40
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
    /* Upload image */
    imageContainer: {
        marginVertical: 25,
        marginHorizontal: 15
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        marginBottom: 10
    },
    extraImageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    smallImage: {
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
    },
    /* Button */
    action: {
        marginVertical: 8,
        marginHorizontal: 14,
        paddingBottom: 40
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

export default AddCarPhotoScreen;