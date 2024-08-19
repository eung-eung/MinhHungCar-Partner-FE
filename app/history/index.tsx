import { View, Text, StatusBar, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
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
    parking_lot: string;
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
  parking_lot: string;
  status: string;
  rating: number
}



const formatDateWithTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const year = date.getFullYear().toString().slice(-2);
  return `${hours}:${minutes} ${day}/${month}/${year}`;
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
    case 'canceled':
      return { borderColor: '#D21312', color: '#D21312' };
    case 'appraising_car_rejected':
      return { borderColor: '#8C6A5D', color: '#8C6A5D' };
    default:
      return { borderColor: 'grey', color: 'grey' };
  }
};

const statusConvert: Record<string, string> = {
  no_filter: 'Tất cả',
  waiting_partner_approval: 'Chờ xác nhận',
  waiting_for_agreement: 'Chờ chấp thuận',
  waiting_contract_payment: 'Chờ thanh toán',
  ordered: 'Đã đặt',
  appraising_car_approved: 'Đủ điều kiện bàn giao',
  renting: 'Đang thuê',
  returned_car: 'Đã trả xe',
  appraised_return_car: 'Hoàn thành kiểm tra',
  completed: 'Hoàn thành',
  pending_resolve: 'Đang xử lí sự cố',
  resolved: 'Đã xử lí sự cố',
  canceled: 'Đã hủy',
  appraising_car_rejected: 'Không đủ điều kiện'
};

const statusCarConvert: Record<string, string> = {
  active: 'Đang hoạt động',
  inactive: 'Dừng hoạt động',
  temporary_inactive: 'Tạm ngưng hoạt động'
};



const getStatusCarStyles = (status: string | undefined) => {
  switch (status) {
    case 'active':
      return { color: 'green' };
    case 'temporary_inactive':
      return { color: '#6482AD' };
    case 'inactive':
      return { color: 'red' };
    default:
      return { color: 'gray' };
  }
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

  const [detailCar, setDetailCar] = useState<CarDetail>();
  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);

  // console.log("carID: ", carID)

  useEffect(() => {
    getActivity();
    getDetailCar();
  }, [activeTab, isFocused, carID])

  const getActivity = async () => {
    try {
      const response = await axios.get(`https://minhhungcar.xyz/partner/activity?car_id=${carID}&customer_contract_status=${activeTab}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })


      const filterData = response.data.data.filter((data: Activity) => {
        return (
          data.status === 'ordered' ||
          data.status === 'renting' ||
          data.status === 'completed' ||
          data.status === 'waiting_partner_approval' ||
          data.status === 'canceled'
        );
      });
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
        console.log('Erro get detail car at history: ', error.response.data.message);
      } else {
        console.log('Error getDetailCar: ', error.response.data.message);
      }
    }
  };


  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      getActivity(),
      getDetailCar(),
    ]);
    setRefreshing(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9', }}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.container}>
              {/* Info */}
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 10,
                  marginBottom: 15,
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: '#333',
                  }}
                >
                  {detailCar?.car_model.brand +
                    ' ' +
                    detailCar?.car_model.model +
                    ' ' +
                    detailCar?.car_model.year}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#666',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    Biển số xe: {detailCar?.license_plate}
                  </Text>
                  <Text
                    style={{
                      color: getStatusCarStyles(detailCar?.status).color,
                      fontWeight: 'bold',
                      fontSize: 14,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: getStatusCarStyles(detailCar?.status).color,
                      borderRadius: 15,
                      textAlign: 'center',
                    }}
                  >
                    {statusCarConvert[detailCar?.status ?? 'inactive'] || 'Unknown Status'}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      marginVertical: 5,
                      fontWeight: '700',
                      color: '#555',
                    }}
                  >
                    Chỗ để xe: {' '}
                  </Text>
                  <Text
                    style={{
                      marginVertical: 5,
                      fontWeight: '500',
                      color: '#555',
                    }}
                  >
                    {detailCar?.parking_lot === 'home' ? 'Tại nhà' : 'Bãi đỗ MinhHungCar'}
                  </Text>
                </View>
              </View>



              {/* Tab */}
              <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                  <TouchableOpacity onPress={() => handleTabPress('no_filter')} style={[styles.tabItem, activeTab === 'no_filter' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'no_filter' && { color: '#773BFF', fontWeight: '600' }]}>Tất cả</Text>
                  </TouchableOpacity>
                  {detailCar?.parking_lot === 'home' ?
                    <TouchableOpacity onPress={() => handleTabPress('waiting_partner_approval')} style={[styles.tabItem, activeTab === 'waiting_partner_approval' && styles.activeTabItem]}>
                      <Text style={[styles.tabText, activeTab === 'waiting_partner_approval' && { color: '#773BFF', fontWeight: '600' }]}>Chờ xác nhận</Text>
                    </TouchableOpacity>
                    : ""}
                  <TouchableOpacity onPress={() => handleTabPress('waiting_for_agreement')} style={[styles.tabItem, activeTab === 'waiting_for_agreement' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'waiting_for_agreement' && { color: '#773BFF', fontWeight: '600' }]}>Chờ chấp thuận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('waiting_contract_payment')} style={[styles.tabItem, activeTab === 'waiting_contract_payment' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'waiting_contract_payment' && { color: '#773BFF', fontWeight: '600' }]}>Chờ thanh toán</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('ordered')} style={[styles.tabItem, activeTab === 'ordered' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'ordered' && { color: '#773BFF', fontWeight: '600' }]}>Đã đặt</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('appraising_car_approved')} style={[styles.tabItem, activeTab === 'appraising_car_approved' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'appraising_car_approved' && { color: '#773BFF', fontWeight: '600' }]}>Đủ điều kiện bàn giao</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleTabPress('renting')} style={[styles.tabItem, activeTab === 'renting' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'renting' && { color: '#773BFF', fontWeight: '600' }]}>Đang thuê</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('returned_car')} style={[styles.tabItem, activeTab === 'returned_car' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'returned_car' && { color: '#773BFF', fontWeight: '600' }]}>Đã trả xe</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('appraised_return_car')} style={[styles.tabItem, activeTab === 'appraised_return_car' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'appraised_return_car' && { color: '#773BFF', fontWeight: '600' }]}>Hoàn thành kiểm tra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('completed')} style={[styles.tabItem, activeTab === 'completed' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'completed' && { color: '#773BFF', fontWeight: '600' }]}>Hoàn thành</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('pending_resolve')} style={[styles.tabItem, activeTab === 'pending_resolve' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'pending_resolve' && { color: '#773BFF', fontWeight: '600' }]}>Đang xử lí sự cố</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('resolved')} style={[styles.tabItem, activeTab === 'resolved' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'resolved' && { color: '#773BFF', fontWeight: '600' }]}>Đã xử lí sự cố</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('appraising_car_rejected')} style={[styles.tabItem, activeTab === 'appraising_car_rejected' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'appraising_car_rejected' && { color: '#773BFF', fontWeight: '600' }]}>Không đủ điều kiện</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTabPress('canceled')} style={[styles.tabItem, activeTab === 'canceled' && styles.activeTabItem]}>
                    <Text style={[styles.tabText, activeTab === 'canceled' && { color: '#773BFF', fontWeight: '600' }]}>Đã hủy</Text>
                  </TouchableOpacity>

                </ScrollView>
              </View>

              {/* Card */}
              <View>
                {activityHistory.length > 0 ?
                  <>
                    {activityHistory.map((act, index) => {
                      const startDate = formatDateWithTime(new Date(act.start_date));
                      const endDate = formatDateWithTime(new Date(act.end_date));

                      return (
                        <View key={index} style={styles.card}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ fontWeight: '600', marginLeft: 8 }}>{startDate}</Text>
                              <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>→</Text>
                              <Text style={{ fontWeight: '600' }}>{endDate}</Text>
                            </View>
                          </View>
                          <Divider style={{ marginBottom: 10, marginTop: -5 }} />
                          <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                            <Text style={{ color: getStatusStyles(act.status).color, fontWeight: 'bold', marginBottom: 10, marginTop: 3 }}>{statusConvert[act.status]}</Text>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.cardBody}>
                                <View style={styles.cardRow}>
                                  <Text style={styles.cardTag}>Thành tiền:  {(act.rent_price + act.insurance_amount).toLocaleString()} VNĐ</Text>
                                  <TouchableOpacity
                                    onPress={() => {
                                      router.push({
                                        pathname: '/activityDetail', params: {
                                          carID: carID,
                                          activityID: act.id
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
    backgroundColor: '#F9F9F9',
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
