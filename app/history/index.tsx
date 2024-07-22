import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthConText } from '@/store/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';


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
  rating: number
}

const convertUTCToICT = (utcDateStr: string) => {
  const utcDate = new Date(utcDateStr);
  const ictOffset = 7 * 60;
  const ictDate = new Date(utcDate.getTime() + (ictOffset * 60 * 1000));
  return ictDate;
};

const formatDateToDDMMYYYY = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'no_filter':
      return { borderColor: '#F89F36', color: '#F89F36' };
    case 'waiting_contract_payment':
      return { borderColor: '#56AEFF', color: '#56AEFF' };
    case 'waiting_for_agreement':
      return { borderColor: 'gray', color: 'gray' };
    case 'ordered':
      return { borderColor: '#F4BB4C', color: '#F4BB4C' };
    case 'renting':
      return { borderColor: '#24D02B', color: '#24D02B' };
    case 'completed':
      return { borderColor: '#15891A', color: '#15891A' };
    default:
      return {};
  }
};

const statusConvert: Record<string, string> = {
  no_filter: 'Tất cả',
  waiting_for_agreement: 'Chờ chấp thuận',
  waiting_contract_payment: 'Chờ thanh toán',
  ordered: 'Đã đặt',
  renting: 'Đang thuê',
  completed: 'Hoàn thành',
};



const HistoryScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('no_filter');
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { carID } = params
  const [activityHistory, setActivityHistory] = useState<Activity[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const [newestStatus, setNewestStatus] = useState()
  const [detailCar, setDetailCar] = useState<CarDetail>();
  const isFocused = useIsFocused();

  // console.log("carID: ", carID)

  useEffect(() => {
    getActivity();
    getDetailCar();
  }, [activeTab, page, isFocused, carID])

  const getActivity = async () => {
    try {
      const response = await axios.get(`https://minhhungcar.xyz/partner/activity?car_id=${carID}&customer_contract_status=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setActivityHistory(response.data.data);
      // console.log("Fetch activity history: ", response.data.message)
      setLoading(false);
    } catch (error: any) {
      console.log("Error get Activity history: ", error.response.data.message)
    }
  }

  const getDetailCar = async () => {
    try {
      const response = await axios.get(`https://minhhungcar.xyz/car/${carID}`);
      setDetailCar(response.data.data);
      // console.log('Fetch successfully: ', response.data.message);
    } catch (error: any) {
      if (error.response.data.error_code === 10027) {
        Alert.alert('Lỗi', 'Không thể xem được chi tiết xe lúc này. Vui lòng thử lại sau!');
      } else {
        console.log('Error getDetailCar: ', error.response.data.message);
      }
    }
  };


  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };



  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.container}>
              {/* Info */}
              <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', marginBottom: 10, paddingVertical: 20, justifyContent: 'center', paddingLeft: 28 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>{detailCar?.car_model.brand + ' ' + detailCar?.car_model.model + ' ' + detailCar?.car_model.year}</Text>
                <Text style={{ fontSize: 14, color: '#939393', marginBottom: 9, marginTop: 8, fontWeight: '600', textTransform: 'uppercase' }}>Biển số xe: {detailCar?.license_plate}</Text>
                {/* <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                <Text style={{ fontSize: 14, marginRight: 5 }}>Hoạt động mới nhất:</Text>
                <Text style={{ fontSize: 14, color: '#24D02B', fontWeight: 'bold' }}>---</Text>
              </View> */}
              </View>

              {/* Tab */}
              <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                  <TouchableOpacity onPress={() => handleTabPress('no_filter')} style={[styles.tabItem, activeTab === 'no_filter' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'no_filter' && { color: '#773BFF', fontWeight: '600' }]}>Tất cả</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('ordered')} style={[styles.tabItem, activeTab === 'ordered' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'ordered' && { color: '#773BFF', fontWeight: '600' }]}>Đã đặt</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('renting')} style={[styles.tabItem, activeTab === 'renting' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'renting' && { color: '#773BFF', fontWeight: '600' }]}>Đang thuê</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('completed')} style={[styles.tabItem, activeTab === 'completed' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'completed' && { color: '#773BFF', fontWeight: '600' }]}>Hoàn thành</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('waiting_for_agreement')} style={[styles.tabItem, activeTab === 'waiting_for_agreement' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'waiting_for_agreement' && { color: '#773BFF', fontWeight: '600' }]}>Chờ chấp thuận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('waiting_contract_payment')} style={[styles.tabItem, activeTab === 'waiting_contract_payment' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'waiting_contract_payment' && { color: '#773BFF', fontWeight: '600' }]}>Chờ thanh toán</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Card */}
              <View>
                {activityHistory.length > 0 ?
                  <>
                    {activityHistory.map((act, index) => {
                      const startDate = formatDateToDDMMYYYY(convertUTCToICT(act.start_date));
                      const endDate = formatDateToDDMMYYYY(convertUTCToICT(act.end_date));

                      return (
                        <View key={index} style={styles.card}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ fontWeight: '600', marginLeft: 8 }}>{startDate}</Text>
                              <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>→</Text>
                              <Text style={{ fontWeight: '600' }}>{endDate}</Text>
                            </View>
                            <Text style={{ color: getStatusStyles(act.status).color, fontWeight: 'bold' }}>{statusConvert[act.status]}</Text>
                          </View>
                          <Divider style={{ marginBottom: 10, marginTop: -5 }} />
                          <View style={{ flexDirection: 'row' }}>
                            <View style={styles.cardBody}>
                              {/* <Text style={styles.cardTitle}>HUYNDAI I10 2023</Text> */}
                              <View style={styles.cardRow}>
                                <Text style={styles.cardTag}>Thành tiền:  {(act.rent_price + act.insurance_amount).toLocaleString()} VNĐ</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    router.push({
                                      pathname: '/activityDetail', params: {
                                        licensePlate: act.car.license_plate,
                                        carName: `${act.car.car_model.brand} ${act.car.car_model.model} ${act.car.car_model.year}`,
                                        startDate: startDate,
                                        endDate: endDate,
                                        feebackRating: act.feedback_rating,
                                        feebackContent: act.feedback_content,
                                        rentPrice: act.rent_price,
                                        customerName: act.customer.first_name + ' ' + act.customer.last_name,
                                        avatarUrl: act.customer.avatar_url,
                                        net_receive: act.net_receive
                                      }
                                    })
                                  }}
                                  style={styles.button}>
                                  <Text style={{ color: 'white', fontSize: 14 }}>Chi tiết</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </>
                  :
                  <Text style={{ fontSize: 16, color: '#B4B4B8', textAlign: 'center', marginTop: 30, marginHorizontal: 30 }}>
                    Không có hoạt động nào
                    trong trạng thái {statusConvert[activeTab]}
                  </Text>
                }
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 25,
    height: 'auto'
  },
  cardBody: {
    flex: 1,
    paddingLeft: 8,
  },
  cardTag: {
    fontSize: 13,
    color: 'red',
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
