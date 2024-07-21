import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useIsFocused } from '@react-navigation/native';
import { AuthConText } from "@/store/AuthContext";
import axios from "axios";

interface Payment {
    id: number;
    partner_id: number;
    start_date: string;
    end_date: string;
    amount: number;
    payment_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface AreaChartProps {
    ptData: Payment[];
}

const AreaChart: React.FC<AreaChartProps> = ({ ptData }) => {


    const formatDateICT = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            timeZone: 'Asia/Bangkok',
            day: '2-digit',
            month: '2-digit',
        });
    };

    const formatDateICTYear = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            timeZone: 'Asia/Bangkok',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <View
            style={{
                paddingBottom: 50,
                paddingTop: 20,
                paddingHorizontal: 10,
                backgroundColor: 'white',
            }}
        >
            <LineChart
                areaChart
                data={ptData.map(payment => ({
                    value: payment.amount / 10000,
                    date: formatDateICTYear(payment.created_at),
                    label: formatDateICT(payment.created_at),
                    labelTextStyle: { color: 'gray', width: 80 },
                }))}
                rotateLabel
                width={270}
                hideDataPoints
                spacing={50}
                color="#757575"
                thickness={2}
                startFillColor="rgba(119, 59, 255, 1)"
                endFillColor="rgba(68, 126, 255, 1)"
                startOpacity={0.9}
                endOpacity={0.2}
                initialSpacing={5}
                noOfSections={5}
                maxValue={200}
                yAxisColor="white"
                yAxisThickness={0}
                rulesType="dashed"
                rulesColor="lightgray"
                yAxisTextStyle={{ color: 'gray' }}
                // yAxisSide="right"
                xAxisColor="lightgray"
                pointerConfig={{
                    pointerStripHeight: 160,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    pointerColor: 'lightgray',
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 90,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {

                        return (
                            <View
                                style={{
                                    height: 90,
                                    width: 100,
                                    justifyContent: 'center',
                                    marginTop: -5,
                                    marginLeft: -40,
                                }}
                            >
                                <Text style={{ color: 'black', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                                    {items[0].date}
                                </Text>
                                <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                        {items[0].value}
                                    </Text>
                                </View>
                            </View>
                        );
                    },
                }}
            />
        </View>
    );
};

export default AreaChart;
