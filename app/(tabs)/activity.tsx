import React, { useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface CarData {
    name: string;
    imagePath: string;
    licensePlate: string;
    model: string;
    status: string;
}

const carsData: CarData[] = [
    { name: 'Tesla Model S', imagePath: 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60', licensePlate: 'K38BIG', model: 'Tesla Model S', status: 'Đang thuê' },
    { name: 'Mercedes-Benz S-Class', imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/R8_Coupe_V10_performance-1.jpg', licensePlate: 'K38BIG', model: 'Tesla Model S', status: 'Đã đặt' },
    { name: 'Audi R8', imagePath: 'https://katavina.com/uploaded/tin/BMW-i8/BMW-i8.jpg', licensePlate: 'K38BIG', model: 'Tesla Model S', status: 'Trong kho' },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Đang thuê':
            return '#24D02B';
        case 'Đã đặt':
            return '#F4BB4C';
        case 'Trong kho':
            return '#909090';
        default:
            return '#000000';
    }
};

const ActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Tất cả');

    const handleTabPress = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.container}>
                        {/* Tab */}
                        <View style={styles.tabContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                                {['Tất cả', 'Đang thuê', 'Đã đặt', 'Trong kho'].map((tab, index) => (
                                    <TouchableOpacity key={index} onPress={() => handleTabPress(tab)} style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}>
                                        <Text style={[styles.tabText, activeTab === tab && { color: '#773BFF', fontWeight: '600' }]}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Card */}
                        <View>
                            {carsData.map((car, index) => (
                                <View key={index} style={styles.card}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            resizeMode="cover"
                                            source={{ uri: car.imagePath }}
                                            style={styles.cardImg}
                                        />
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTag}>Biển số xe: {car.licensePlate}</Text>
                                            <Text style={styles.cardTitle}>{car.name}</Text>
                                            <View style={styles.cardRow}>
                                                <View style={styles.cardRowItem}>
                                                    <Text style={{ color: getStatusColor(car.status), fontWeight: '600', fontSize: 15 }}>{car.status}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={{ width: 80, height: 30, backgroundColor: '#773BFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                                                    onPress={() => { navigation.navigate('History') }}
                                                >
                                                    <Text style={{ color: 'white', fontSize: 14 }}>Lịch sử</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 25,
        height: 'auto',
    },
    cardImg: {
        width: 150,
        height: 'auto',
        borderRadius: 12,
    },
    cardBody: {
        flex: 1,
        paddingLeft: 14,
        paddingVertical: 5,
    },
    cardTag: {
        fontSize: 13,
        color: '#939393',
        marginBottom: 9,
        textTransform: 'capitalize',
    },
    cardTitle: {
        fontSize: 20,
        color: '#000',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    cardRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabContainer: {
        height: 60,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    scrollViewContent: {
        paddingHorizontal: 30,
    },
    tabItem: {
        height: 60,
        justifyContent: 'center',
        marginRight: 30,
    },
    activeTabItem: {
        borderBottomColor: '#773BFF',
        borderBottomWidth: 3,
    },
    tabText: {
        fontSize: 16,
        color: 'black',
    },
});

export default ActivityScreen;
