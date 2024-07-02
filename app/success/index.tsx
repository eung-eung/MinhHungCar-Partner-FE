import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, Alert } from 'react-native';

const SuccessScreen = () => {

    const router = useRouter()


    return (
        <View style={styles.container}>
            <Image
                style={styles.icon}
                source={{ uri: 'https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/155_check_ok_sticker_success-512.png' }}
            />
            <Text style={styles.title}>Chúc mừng bạn!</Text>
            <Text style={styles.description}>
                Bạn đã gửi yêu cầu đăng kí cho thuê xe thành công. Vui lòng đợi phản hồi từ MinhHungCar.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => { router.replace('/car') }}>
                <Text style={styles.buttonText}>Trở về trang Xe của tôi</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    icon: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        color: '#666666',
        fontSize: 16,
        marginBottom: 30,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#773BFF',
        paddingVertical: 13,
        paddingHorizontal: 80,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});

export default SuccessScreen;
