import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { AuthConText } from '@/store/AuthContext';
import { useRouter } from 'expo-router';
import { apiCar } from '@/api/apiConfig';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';

interface CarModel {
    id: string;
    year: number;
    brand: string;
    model: string;
    number_of_seats: number;
    based_price: number;
}

interface MotionData {
    code: string;
    text: string;
}

interface FuelData {
    code: string;
    text: string;
}

interface ParkingLotData {
    code: string;
    text: string;
}

interface PeriodData {
    code: string;
    text: string;
}


const AddCarInformationScreen: React.FC = () => {
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    const router = useRouter();

    const [licensePlate, setLicensePlate] = useState<string>('');
    const [carModelId, setCarModelId] = useState<string>('');
    const [selectedMotionCode, setSelectedMotionCode] = useState<string>('');
    const [selectedFuelCode, setSelectedFuelCode] = useState<string>('');
    const [selectedParking, setSelectedParking] = useState<string>('');
    const [selectedPeriodCode, setSelectedPeriodCode] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [basePrice, setBasePrice] = useState<string>('');

    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [seats, setSeats] = useState<string[]>([]);

    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedSeat, setSelectedSeat] = useState<string>('');

    const [carList, setCarList] = useState<CarModel[]>([]);
    const [periodData, setPeriodData] = useState<PeriodData[]>([]);
    const [fuelData, setFuelData] = useState<FuelData[]>([]);
    const [motionData, setMotionData] = useState<MotionData[]>([]);
    const [parkingLotData, setParkingLotData] = useState<ParkingLotData[]>([]);
    const [parkingLotMetadata, setParkingLotMetadata] = useState<ParkingLotData[]>([]);

    const [isLoading, setLoading] = useState<boolean>(true);
    const [isLoadButton, setLoadButton] = useState<boolean>(false);

    const [id, setId] = useState<string>('');

    const isDisabled = (
        !licensePlate ||
        !carModelId ||
        !selectedMotionCode ||
        !selectedFuelCode ||
        !selectedParking ||
        !selectedPeriodCode ||
        !description ||
        !selectedBrand ||
        !selectedModel ||
        !selectedYear ||
        !selectedSeat ||
        isLoadButton
    );

    useEffect(() => {
        fetchYearData();
        fetchPeriodData();
        fetchFuelData();
        fetchMotionData();

    }, []);

    useEffect(() => {
        fetchParkingLotData();
    }, []);

    useEffect(() => {
        fetchParkingLotMetadata();
    }, [selectedSeat]);

    useEffect(() => {
        if (id && basePrice) {
            router.push({ pathname: "/addCarPhoto", params: { carId: id, based_price: basePrice } });
        }
    }, [id, basePrice]);

    const fetchPeriodData = async () => {
        try {
            const response = await axios.get(apiCar.getCarMetadata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const periods: PeriodData[] = response.data.periods;
            setPeriodData(periods);
        } catch (error) {
            console.log('Error fetching periods:', error);
            setPeriodData([]); // Set an empty array or default value
        }
    };

    const fetchFuelData = async () => {
        try {
            const response = await axios.get(apiCar.getCarMetadata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const fuels: FuelData[] = response.data.fuels;
            setFuelData(fuels);
        } catch (error) {
            console.log('Error fetching fuels:', error);
        }
    };

    const fetchMotionData = async () => {
        try {
            const response = await axios.get(apiCar.getCarMetadata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const motions: MotionData[] = response.data.motions;
            setMotionData(motions);
        } catch (error) {
            console.log('Error fetching motions:', error);
        }
    };

    const fetchParkingLotData = async () => {
        try {
            const response = await axios.get(apiCar.getCarMetadata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const parking_lot: ParkingLotData[] = response.data.parking_lot;
            setParkingLotData(parking_lot);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching parking_lot:', error);
        }
    };

    const fetchParkingLotMetadata = async () => {
        if (selectedSeat) {
            console.log("Fetching parking lot metadata for seat:", selectedSeat);
            try {
                const response = await axios.get(`https://minhhungcar.xyz/register_car_metadata/parking_lot?seat_type=${selectedSeat}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // console.log("API Response:", response.data);
                const parking_lot: ParkingLotData[] = response.data.data;
                setParkingLotMetadata(parking_lot);
                setLoading(false);
            } catch (error: any) {
                console.log("Error fetching parking lot metadata:", error);
                if (error.response?.data?.error_code === 10044) {
                    Alert.alert('Lỗi', 'Không thể lấy dữ liệu của chỗ để xe');
                } else {
                    Alert.alert('Lỗi hệ thống', 'Không thể lấy dữ liệu của chỗ để xe');
                }
            }
        } else {
            // console.log("Selected seat is not set, using parkingLotData");
            setParkingLotMetadata(parkingLotData);
        }
    };




    const fetchYearData = async () => {
        try {
            const response = await axios.get(apiCar.getCarMetadata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const carModels: CarModel[] = response.data.models;
            setCarList(carModels);
            const uniqueYears: string[] = [...new Set(carModels.map((model: CarModel) => model.year.toString()))];
            setYears(uniqueYears);
        } catch (error) {
            console.log('Error fetching years:', error);
        }
    };

    const fetchRemainData = async (year: string) => {
        const filteredCars = carList.filter((model) => model.year.toString() === year);
        const uniqueBrands: string[] = [...new Set(filteredCars.map((model) => model.brand))];
        setBrands(uniqueBrands);

        setSelectedBrand('');
        setSelectedModel('');
        setSelectedSeat('');

        if (uniqueBrands.length > 0) {
            await fetchBrandModelsAndSeats(year, uniqueBrands[0]);
        } else {
            setModels([]);
            setSeats([]);
        }
    };

    const fetchBrandModelsAndSeats = async (year: string, brand: string) => {
        const filteredCars = carList.filter((model) => model.year.toString() === year && model.brand === brand);
        const uniqueModels: string[] = [...new Set(filteredCars.map((model) => model.model))];
        const uniqueSeats: string[] = [...new Set(filteredCars.map((model) => model.number_of_seats.toString()))];

        setModels(uniqueModels);
        setSeats(uniqueSeats);
    };

    const handleYearChange = async (year: string) => {
        setSelectedYear(year);

        setSelectedBrand('');
        setSelectedModel('');
        setSelectedSeat('');
        setBrands([]);
        setModels([]);
        setSeats([]);
        setParkingLotMetadata([]);

        await fetchRemainData(year);
        await fetchParkingLotMetadata();
    };

    const handleBrandChange = async (brand: string) => {
        setSelectedBrand(brand);
        setSelectedModel('');
        setSelectedSeat('');

        const filteredCars = carList.filter((m) => m.year.toString() === selectedYear && m.brand === brand);
        const uniqueModels: string[] = [...new Set(filteredCars.map((m) => m.model))];
        setModels(uniqueModels);

        setSeats([]);
        setParkingLotMetadata([]);
    };

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        setSelectedSeat('');

        const filteredModels = carList.filter((m) =>
            m.year.toString() === selectedYear &&
            m.brand === selectedBrand &&
            m.model === model
        );

        const uniqueSeats: string[] = [...new Set(filteredModels.map((m) => m.number_of_seats.toString()))];
        setSeats(uniqueSeats);

        setParkingLotMetadata([]);
        if (uniqueSeats.length > 0) {
            setSelectedSeat(uniqueSeats[0]);
            fetchParkingLotMetadata();
        }

        getCarModelIdAndBasePrice(model, selectedSeat);
    };

    const getCarModelIdAndBasePrice = (model: string, seat: string) => {
        const filteredCar = carList.find(
            (car) =>
                car.year.toString() === selectedYear &&
                car.brand === selectedBrand &&
                car.model === model &&
                car.number_of_seats.toString() === seat
        );
        if (filteredCar) {
            setCarModelId(filteredCar.id);
            setBasePrice(filteredCar.based_price.toString());
        }
    };

    const handleSeatChange = async (seat: string) => {
        setSelectedSeat(seat);
        await fetchParkingLotMetadata();
        getCarModelIdAndBasePrice(selectedModel, seat);
    };

    const validateLicensePlate = (licensePlate: any) => {
        licensePlate = licensePlate.trim();

        const pattern = /^(?:\d{2}[a-zA-Z]\d{4}|\d{2}[a-zA-Z]\d{5})$/;



        if (!pattern.test(licensePlate)) {
            Alert.alert('Lỗi', 'Sai cú pháp biển số xe. Vui lòng nhập lại!');
            return false;
        }

        return true;
    };
    const handleSubmit = async () => {
        console.log("selectedPeriodCode: ", selectedPeriodCode)
        // Check if user has filled in all required fields
        if (
            !licensePlate ||
            !carModelId ||
            !selectedMotionCode ||
            !selectedFuelCode ||
            !selectedParking ||
            !selectedPeriodCode ||
            !description ||
            !selectedBrand ||
            !selectedModel ||
            !selectedYear ||
            !selectedSeat
        ) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả thông tin');
            return;
        }

        if (!validateLicensePlate(licensePlate)) {
            return;
        }

        try {
            setLoadButton(true);

            // Check config in MinhHungCar garage if selectedParking is 'garage'
            // if (selectedParking === 'garage') {
            //     await fetchParkingLotMetadata();
            //     if (parkingLotMetadata.length === 1) {
            //         Alert.alert(
            //             'Lỗi',
            //             'Bãi đổ MinhHungCar không còn chỗ. Vui lòng chọn để xe tại nhà!',
            //             [
            //                 {
            //                     text: 'OK',
            //                     onPress: () => {
            //                         setSelectedParking('home');
            //                     }
            //                 }
            //             ]
            //         );
            //         return; // Prevent form submission
            //     }
            // }

            const response = await axios.post(
                apiCar.registerCar,
                {
                    license_plate: licensePlate,
                    car_model_id: carModelId,
                    motion_code: selectedMotionCode,
                    fuel_code: selectedFuelCode,
                    parking_lot: selectedParking,
                    period_code: selectedPeriodCode,
                    description: description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setId(response.data.data.car.id);
            setBasePrice(response.data.data.car.car_model.based_price);

            // console.log("id: ", response.data.data.car.id);
            // console.log("basePrice: ", response.data.data.car.car_model.based_price);
        } catch (error: any) {
            if (error.response?.data?.error_code === 10062) {
                Alert.alert('Lỗi', 'Biển số xe này đã tồn tại!');
                console.log("Error register car: ", error.response.data.message)
            } else if (error.response?.data?.error_code === 10031) {
                Alert.alert(
                    'Lỗi',
                    'Bãi đổ MinhHungCar không còn chỗ. Vui lòng chọn để xe tại nhà!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setSelectedParking('home');
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Lỗi', 'Thêm xe thất bại. Vui lòng thử lại!');
                console.log("Error register car: ", error.response.data.message)
            }
        } finally {
            setLoadButton(false);
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <LoadingOverlay message='' />
                </View>
            ) : (
                <ScrollView style={styles.container}>

                    {/* Tab */}
                    <View style={styles.tabContainer}>
                        <View style={styles.tabItemContainer}>
                            <View style={styles.tabItemActive}>
                                <View style={styles.tabItemIconActive}>
                                    <TabBarIcon name='clipboard-list-outline' color='white' style={styles.tabImage} />
                                </View>
                                <Text style={styles.tabTextActive}>Thông tin xe</Text>
                            </View>
                            <Divider style={styles.divider} />
                        </View>

                        <View style={styles.tabItemContainer}>
                            <View style={styles.tabItem}>
                                <View style={styles.tabItemIcon}>
                                    <TabBarIcon name='file-image-outline' color='#773BFF' style={styles.tabImage} />
                                </View>
                                <Text style={styles.tabText}>Hình ảnh</Text>
                            </View>
                            <Divider style={styles.divider} />
                        </View>

                        <View style={styles.tabItemContainer}>
                            <View style={styles.tabItem}>
                                <View style={styles.tabItemIcon}>
                                    <TabBarIcon name='file-document-multiple-outline' color='#773BFF' style={styles.tabImage} />
                                </View>
                                <Text style={styles.tabText}>Giấy tờ xe</Text>
                            </View>
                            <Divider style={styles.divider} />
                        </View>

                        <View style={styles.tabItemContainer}>
                            <View style={styles.tabItem}>
                                <View style={styles.tabItemIcon}>
                                    <TabBarIcon name='currency-usd' color='#773BFF' style={styles.tabImage} />

                                </View>
                                <Text style={styles.tabText}>Giá cho thuê</Text>
                            </View>
                        </View>
                    </View>

                    {/* Form */}
                    <KeyboardAwareScrollView>
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>
                                    Biển số xe
                                    <Text style={styles.required}>{' '}*</Text></Text>

                                <TextInput
                                    clearButtonMode="while-editing"
                                    onChangeText={(licensePlate) => setLicensePlate(licensePlate.trim())}
                                    placeholder="Nhập biển số xe"
                                    placeholderTextColor="#C5C5C5"
                                    style={styles.inputControl}
                                    value={licensePlate.toString()}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>
                                    Năm sản xuất
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <RNPickerSelect
                                    onValueChange={(year) => handleYearChange(year)}
                                    placeholder={{
                                        label: "Chọn năm sản xuất",
                                        value: null,
                                        color: '#9EA0A4',
                                    }}
                                    items={years.map((year, index) => ({
                                        key: index.toString(),
                                        label: year,
                                        value: year,
                                    }))}
                                    style={pickerSelectStyles}
                                    Icon={() => {
                                        return <TabBarIcon name='chevron-down' size={24} style={{ paddingRight: 7, paddingTop: 8 }} />
                                    }}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>
                                    Hãng xe
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <RNPickerSelect
                                    onValueChange={(brand) => handleBrandChange(brand)}
                                    placeholder={{
                                        label: "Chọn hãng xe",
                                        value: null,
                                        color: '#9EA0A4',
                                    }}
                                    value={selectedBrand}
                                    items={brands ? brands.map((brand, index) => ({
                                        key: index.toString(),
                                        label: brand,
                                        value: brand,
                                    })) : []}
                                    style={pickerSelectStyles}
                                    Icon={() => {
                                        return <TabBarIcon name='chevron-down' size={24} style={{ paddingRight: 7, paddingTop: 8 }} />
                                    }}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Mẫu xe
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <RNPickerSelect
                                    onValueChange={(model) => handleModelChange(model)}
                                    placeholder={{
                                        label: "Chọn mẫu xe",
                                        value: null,
                                        color: '#9EA0A4',
                                    }}
                                    value={selectedModel}
                                    items={models ? models.map((model, index) => ({
                                        key: index.toString(),
                                        label: model,
                                        value: model,
                                    })) : []}
                                    style={pickerSelectStyles}
                                    Icon={() => {
                                        return <TabBarIcon name='chevron-down' size={24} style={{ paddingRight: 7, paddingTop: 8 }} />
                                    }}
                                />
                            </View>


                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>
                                    Số ghế
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <RNPickerSelect
                                    onValueChange={(seat) => handleSeatChange(seat)}
                                    placeholder={{
                                        label: 'Chọn số ghế',
                                        value: null,
                                        color: 'black',
                                    }}
                                    value={selectedSeat}
                                    items={seats ? seats.map((seat, index) => ({
                                        key: index.toString(),
                                        label: seat,
                                        value: seat,
                                    })) : []}
                                    style={pickerSelectStyles}
                                    Icon={() => {
                                        return <TabBarIcon name='chevron-down' size={24} style={{ paddingRight: 7, paddingTop: 8 }} />
                                    }}
                                />


                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Truyền động
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.radioButtonGroup}>
                                        {motionData ? motionData.map((motion) => (
                                            <TouchableOpacity
                                                key={motion.code}
                                                onPress={() => setSelectedMotionCode(motion.code)}
                                                style={[
                                                    styles.radioButton,
                                                    selectedMotionCode === motion.code && styles.radioButtonSelected,
                                                ]}
                                            >
                                                <View style={styles.radioCircle}>
                                                    {selectedMotionCode === motion.code && (
                                                        <View style={styles.selectedRb} />
                                                    )}
                                                </View>
                                                <Text style={styles.radioText}>{motion.text}</Text>
                                            </TouchableOpacity>
                                        )) : []}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Nhiên liệu
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.radioButtonGroup}>
                                        {fuelData ? fuelData.map((fuel) => (
                                            <TouchableOpacity
                                                key={fuel.code}
                                                onPress={() => setSelectedFuelCode(fuel.code)}
                                                style={[
                                                    styles.radioButton,
                                                    selectedFuelCode === fuel.code && styles.radioButtonSelected,
                                                ]}
                                            >
                                                <View style={styles.radioCircle}>
                                                    {selectedFuelCode === fuel.code && (
                                                        <View style={styles.selectedRb} />
                                                    )}
                                                </View>
                                                <Text style={styles.radioText}>{fuel.text}</Text>
                                            </TouchableOpacity>
                                        )) : []}
                                    </View>
                                </View>

                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Chỗ để xe
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.radioButtonGroup}>
                                        {!selectedSeat ? (
                                            parkingLotData.length > 0 ? parkingLotData.map((lot) => (
                                                <TouchableOpacity
                                                    key={lot.code}
                                                    onPress={() => setSelectedParking(lot.code)}
                                                    style={[
                                                        styles.radioButton,
                                                        selectedParking === lot.code && styles.radioButtonSelected,
                                                    ]}
                                                >
                                                    <View style={styles.radioCircle}>
                                                        {selectedParking === lot.code && (
                                                            <View style={styles.selectedRb} />
                                                        )}
                                                    </View>
                                                    <Text style={styles.radioText}>{lot.text}</Text>
                                                </TouchableOpacity>
                                            )) : <Text style={styles.noDataText}>Không có dữ liệu bãi đỗ xe</Text>
                                        ) : (
                                            parkingLotMetadata.length > 0 ? parkingLotMetadata.map((lot) => (
                                                <TouchableOpacity
                                                    key={lot.code}
                                                    onPress={() => setSelectedParking(lot.code)}
                                                    style={[
                                                        styles.radioButton,
                                                        selectedParking === lot.code && styles.radioButtonSelected,
                                                    ]}
                                                >
                                                    <View style={styles.radioCircle}>
                                                        {selectedParking === lot.code && (
                                                            <View style={styles.selectedRb} />
                                                        )}
                                                    </View>
                                                    <Text style={styles.radioText}>{lot.text}</Text>
                                                </TouchableOpacity>
                                            )) : <Text style={styles.noDataText}>Không có dữ liệu bãi đỗ xe</Text>
                                        )}
                                    </View>
                                </View>
                            </View>



                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Kỳ hạn cho thuê xe
                                    <Text style={styles.required}>{' '}*</Text>
                                </Text>

                                <RNPickerSelect
                                    onValueChange={(period) => setSelectedPeriodCode(period)}
                                    placeholder={{
                                        label: "Chọn kỳ hạn",
                                        value: null,
                                        color: '#9EA0A4',
                                    }}
                                    items={periodData ? periodData.map((period) => ({
                                        key: period.code,
                                        label: period.text,
                                        value: period.code,
                                    })) : []}
                                    style={pickerSelectStyles}
                                    Icon={() => {
                                        return <TabBarIcon name='chevron-down' size={24} style={{ paddingRight: 7, paddingTop: 8 }} />
                                    }}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>
                                    Mô tả
                                    <Text style={styles.required}>{' '}*</Text></Text>

                                <TextInput
                                    clearButtonMode="while-editing"
                                    onChangeText={des => setDescription(des)}
                                    placeholder="Nhập mô tả"
                                    placeholderTextColor="#C5C5C5"
                                    style={styles.inputControlTextArea}
                                    value={description.toString()}
                                    multiline={true}
                                    numberOfLines={4} />
                            </View>
                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isDisabled}
                                    style={[styles.btn, isDisabled && styles.btnDisabled]}
                                >
                                    <View>
                                        {isLoadButton ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text style={styles.btnText}>Tiếp tục</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </KeyboardAwareScrollView>

                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    /* Form */
    form: {
        paddingHorizontal: 10,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        marginTop: 30
    },
    formAction: {
        marginVertical: 24,
        marginBottom: 40
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        textAlign: 'center',
        marginBottom: 70,
    },
    /** Input */
    input: {
        marginBottom: 20,
    },
    inputShort: {
        marginBottom: 20,
        width: 160
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    required: {
        color: 'red',
    },
    inputControl: {
        height: 44,
        borderColor: '#B2B2B2',
        borderWidth: 0.5,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderStyle: 'solid',
    },
    inputControlTextArea: {
        height: 100,
        borderColor: '#B2B2B2',
        borderWidth: 0.5,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderStyle: 'solid',
        textAlignVertical: 'top',
        paddingVertical: 10,
        paddingTop: 12
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#5548E2',
        borderColor: '#5548E2',
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
    icon: {
        marginRight: 24,
        marginVertical: 18,
        width: 20,
        height: 10
    },

    /* Radio */
    radioButtonGroup: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: 15,
        // justifyContent: 'space-between'
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 40
        // padding: 10,
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 8,
    },
    radioButtonSelected: {
        borderColor: 'black',
        // backgroundColor: '#e0f7ff',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'black',
    },
    radioText: {
        fontSize: 16,
    },
    noDataText: {
        color: '#B4B4B8',
        fontSize: 16,
    },
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 0.5,
        borderColor: '#B2B2B2',
        borderRadius: 12,
        width: '100%',
        height: 44,
        marginBottom: 12,
        color: '#222',
    },
    inputAndroid: {
        fontSize: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#B2B2B2',
        borderRadius: 12,
        width: 335,
        height: 44,
        marginBottom: 12,
        color: '#222',
    },

});


export default AddCarInformationScreen;