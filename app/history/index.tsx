import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'react-native'
import { Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface CarData {
  status: string;
  startDate: string;
  endDate: string;
}

const carsData: CarData[] = [
  { status: 'Đã đặt', startDate: '09/05/2024', endDate: '10/05/2024' },
  { status: 'Hoàn thành', startDate: '09/05/2024', endDate: '10/05/2024' },
  { status: 'Đã hủy', startDate: '09/05/2024', endDate: '10/05/2024' },
];

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Đã đặt':
      return '#F4BB4C';
    case 'Hoàn thành':
      return '#4FB33F';
    case 'Đã hủy':
      return '#F11B1B';
    default:
      return '#000000';
  }
};



const HistoryScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Tất cả');

  const router = useRouter()

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            {/* Info */}
            <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', marginBottom: 10, paddingVertical: 20, justifyContent: 'center', paddingLeft: 28 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>HUYNDAI I10 2023</Text>
              <Text style={{ fontSize: 14, color: '#939393', marginBottom: 9, marginTop: 8, fontWeight: '600' }}>Biển số xe: K38BIG</Text>
              <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                <Text style={{ fontSize: 14, marginRight: 5 }}>Hoạt động mới nhất:</Text>
                <Text style={{ fontSize: 14, color: '#24D02B', fontWeight: 'bold' }}>Đang thuê</Text>
              </View>
            </View>

            {/* Tab */}
            <View style={styles.tabContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                <TouchableOpacity onPress={() => handleTabPress('Tất cả')} style={[styles.tabItem, activeTab === 'Tất cả' && styles.activeTabItem]}>
                  <Text style={[styles.tabText, activeTab === 'Tất cả' && { color: '#773BFF', fontWeight: '600' }]}>Tất cả</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleTabPress('Đã đặt')} style={[styles.tabItem, activeTab === 'Đã đặt' && styles.activeTabItem]}>
                  <Text style={[styles.tabText, activeTab === 'Đã đặt' && { color: '#773BFF', fontWeight: '600' }]}>Đã đặt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabPress('Hoàn thành')} style={[styles.tabItem, activeTab === 'Hoàn thành' && styles.activeTabItem]}>
                  <Text style={[styles.tabText, activeTab === 'Hoàn thành' && { color: '#773BFF', fontWeight: '600' }]}>Hoàn thành</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabPress('Đã hủy')} style={[styles.tabItem, activeTab === 'Đã hủy' && styles.activeTabItem]}>
                  <Text style={[styles.tabText, activeTab === 'Đã hủy' && { color: '#773BFF', fontWeight: '600' }]}>Đã hủy</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Card */}
            <View>
              {carsData.map((car, index) => (
                <View key={index} style={styles.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontWeight: '600' }}>{car.startDate}</Text>
                      <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>→</Text>
                      <Text style={{ fontWeight: '600' }}>{car.endDate}</Text>
                    </View>
                    <Text style={{ color: getStatusColor(car.status), fontWeight: '600', fontSize: 15 }}>{car.status}</Text>
                  </View>
                  <Divider style={{ marginBottom: 10, marginTop: -5 }} />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>HUYNDAI I10 2023</Text>
                      <View style={styles.cardRow}>
                        <Text style={styles.cardTag}>Biển số xe:  K38BIG</Text>
                        <TouchableOpacity
                          onPress={() => { router.push('/activityDetail') }}
                          style={styles.button}>
                          <Text style={{ color: 'white', fontSize: 14 }}>Chi tiết</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 25,
    height: 'auto'
  },
  cardBody: {
    flex: 1,
    paddingLeft: 14,
  },
  cardTag: {
    fontSize: 13,
    color: '#939393',
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: 20,
    color: '#000',
    marginBottom: 8,
    fontWeight: 'bold'
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5
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
  button: {
    width: 80,
    height: 30,
    backgroundColor: '#773BFF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default HistoryScreen;
