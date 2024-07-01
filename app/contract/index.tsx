import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthConText } from '@/store/AuthContext';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function ContractScreen() {
    const route = useRouter();
    const params = useLocalSearchParams()
    const { carId } = params;
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    const [pdfURL, setPdfURL] = useState('');
    const [contractStatus, setContractStatus] = useState('')   //3 status: approved, active, waiting_car_delivery
    const [isLoading, setLoading] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [refresh, setRefresh] = useState(true)

    const webViewRef = useRef<WebView | null>(null);

    console.log("carID", carId)

    useEffect(() => {
        getDetailContract();
    }, []);

    const getDetailContract = async () => {
        try {
            const response = await axios.get(`https://minhhungcar.xyz/partner/contract?car_id=${carId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPdfURL(response.data.data.url);
            setContractStatus(response.data.data.status);

            console.log('Fetch contract successfully!');
            setTimeout(() => {
                setLoading(false);
            }, 2500);
        } catch (error: any) {
            if (error.response.data.error_code === 10033) {
                Alert.alert('Lỗi', 'Không thể lấy được trạng thái hợp đồng');
            } else if (error.response.data.error_code === 10061) {
                Alert.alert('Lỗi', 'Không thể xem chi tiết hợp đồng lúc này. Vui lòng thử lại sau');
            } else if (error.response.data.error_code === 10001) {
                Alert.alert('Lỗi', 'Không tìm thấy hợp đồng. Vui lòng thử lại sau');
            } else {
                Alert.alert('Lỗi', error.response.data.message);
            }
        }
    };

    const handleAgreeSwitch = (value: any) => {
        setIsChecked(value);
    };

    const handleSignContract = async () => {
        try {
            const response = await axios.put(`https://minhhungcar.xyz/partner/contract/agree`,
                {
                    car_id: carId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log('Sign contract successfully!: ', response.data.message);
            Alert.alert(
                'Chúc mừng',
                'Bạn đã ký hợp đồng thành công! Vui lòng đợi phản hồi từ MinhHungCar',
                [
                    {
                        text: 'OK',
                        onPress: () => route.push('/car')
                    }
                ]
            );
        } catch (error: any) {
            if (error.response.data.error_code === 10060) {
                Alert.alert('Lỗi', 'Không thể ký hợp đồng lúc này. Vui lòng thử lại sau');
            } else {
                console.log('Sign contract error: ', error.response.data.message);
                Alert.alert('Lỗi', error.response.data.message);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingOverlay message='' />
                </View>
            ) : (
                <>
                    <WebView
                        ref={webViewRef}
                        contentMode='desktop'
                        source={{ uri: `https://docs.google.com/gview?embedded=true&url=${pdfURL}` }}
                        style={styles.webview}
                        onLoadEnd={data => {
                            const { nativeEvent } = data
                            const { title } = nativeEvent
                            if (!title.trim()) {
                                webViewRef.current?.stopLoading();
                                webViewRef.current?.reload();
                                setRefresh(prev => !prev)
                            }
                        }}
                    />
                    {contractStatus === 'waiting_for_agreement' &&
                        <>
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchText}>Tôi đồng ý với các điều khoản trong hợp đồng</Text>
                                <Switch
                                    value={isChecked}
                                    onValueChange={handleAgreeSwitch}
                                    trackColor={{ false: '#767577', true: '#773BFF' }}
                                    thumbColor={isChecked ? 'white' : 'white'}
                                    ios_backgroundColor="#3e3e3e"
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.button, !isChecked ? styles.disabledButton : null]}
                                onPress={handleSignContract}
                                disabled={!isChecked}
                            >
                                <Text style={styles.buttonText}>Ký hợp đồng</Text>
                            </TouchableOpacity>
                        </>
                    }
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    webview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#333',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        marginTop: 10,
    },
    switchText: {
        fontSize: 16,
        flex: 1,
    },
    button: {
        backgroundColor: '#773BFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginHorizontal: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});



