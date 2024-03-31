import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { axiosInstance } from '../api/axios';
import Loading from '../components/Loading';
import RNPickerSelect from 'react-native-picker-select';
import { formatDateToDDMMYYYY } from '../util/Dates';

export const Home: React.FC = () => {
    const [loadingState, setLoadingState] = useState<"error" | "ok" | "loading">("loading");
    const [responseData, setResponseData] = useState<HomeData>();
    const [dateData, setDateData] = useState<Data>();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedNumber, setSelectedNumber] = useState<number>(10);

    const handleNumberChange = (number: number) => setSelectedNumber(number);
    const handleDataChange = (date: string) => setSelectedDate(date);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingState("loading");
            try {
                const responseDates = await axiosInstance.get<Data>('available');
                setDateData(responseDates.data);
                setSelectedDate(responseDates.data.dates[0]);
                setLoadingState("ok");
            } catch (error) {
                setLoadingState("error");
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingState("loading");
                const response = await axiosInstance.get<HomeData>(`temp/date/${selectedDate}/${selectedNumber}`);
                setResponseData(response.data);
                setLoadingState("ok");
            } catch (error) {
                setLoadingState("error");
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedDate, selectedNumber]);

    const generatePickerItems = (maxDatesCount: number) => {
        const items = [];
        for (let i = 10; i <= 100; i += 10) {
            if (i <= maxDatesCount) {
                items.push({ label: `Últimas ${i} capturas`, value: i });
            }
        }
        items.push({ label: `Todas as ${maxDatesCount} capturas`, value: maxDatesCount });
        return items;
    };

    return (
        <>
            <View style={styles.container}>
                {dateData && <RNPickerSelect
                    value={selectedDate}
                    onValueChange={handleDataChange}
                    items={dateData.dates.map((date) => ({
                        label: formatDateToDDMMYYYY(date),
                        value: date
                    }))}
                    style={pickerSelectStyles}
                />}

                {dateData && responseData && <RNPickerSelect
                    value={selectedNumber}
                    onValueChange={handleNumberChange}
                    items={generatePickerItems(responseData.maxDatesCount)}
                    style={pickerSelectStyles}
                />}
            </View>
            {loadingState === "ok" && responseData && dateData && (
                <View style={styles.container}>
                    <View style={styles.center}>
                        <Text style={styles.number}>
                            {responseData.averageTemperature && responseData.averageTemperature.toFixed(2)}°C
                        </Text>
                    </View>
                </View>)}
            {loadingState === "loading" && (
                <View style={styles.container}>
                    <View style={styles.center}>
                        <Loading />
                    </View>
                </View>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centralize vertically
        alignItems: 'center', // Centralize horizontally
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        fontSize: 48,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});
