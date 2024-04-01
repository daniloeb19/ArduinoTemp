import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { axiosInstance } from '../api/axios';
import Loading from '../components/Loading';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { formatDateToDDMMYYYY } from '../util/Dates';

const Home: React.FC = () => {
    const [loadingState, setLoadingState] = useState<"error" | "ok" | "loading">("loading");
    const [responseData, setResponseData] = useState<HomeData>();
    const [dateData, setDateData] = useState<Data>();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedNumber, setSelectedNumber] = useState<number>(10);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoadingState("loading");
            try {
                await axiosInstance.get<Data>('available').then((response) => {
                    setDateData(response.data);
                    setSelectedDate(response.data.dates[response.data.dates.length-1]);
                    setLoadingState("ok");
                });
            } catch (error) {
                handleFetchError(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingState("loading");
            try {
                await axiosInstance.get<HomeData>(`temp/date/${selectedDate}/${selectedNumber}`).then((response) => {
                    setResponseData(response.data);
                    setLoadingState("ok");
                });
            } catch (error) {
                handleFetchError(error);
            }
        };
        fetchData();
    }, [selectedDate, selectedNumber]);

    const handleNumberChange = (number: number) => setSelectedNumber(number);
    const handleDataChange = (date: string) => setSelectedDate(date);

    const handleFetchError = (error: any) => {
        setLoadingState("error");
        setError(error.toString());
        console.error('Error fetching data:', error);
    };

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
        <View style={styles.container}>
            <View style={styles.center}>
                {dateData && responseData && (
                    <Picker
                        selectedValue={selectedDate}
                        style={styles.dropdown}
                        onValueChange={handleDataChange}>
                        {dateData.dates.map((date) => (
                            <Picker.Item key={date} label={formatDateToDDMMYYYY(date)} value={date} />
                        ))}
                    </Picker>
                )}

                {dateData && responseData && (
                    <View style={styles.dropdown}>
                        <Picker
                            selectedValue={selectedNumber}
                            style={styles.dropdown}
                            onValueChange={handleNumberChange}>
                            {generatePickerItems(responseData.maxDatesCount).map((date) => (
                                <Picker.Item key={date.value} label={date.label} value={date.value} />
                            ))}
                        </Picker>
                    </View>
                )}
                {loadingState !== "loading" && responseData && dateData && (
                    <Text style={styles.number}>
                        {responseData.averageTemperature && responseData.averageTemperature?.toFixed(2)}°C
                    </Text>
                )}
            </View>

            {
                loadingState === "loading" && (
                    <View style={styles.container}>
                        <View style={styles.center}>
                            <Loading />
                        </View>
                    </View>
                )
            }

            <View style={styles.container}>
                <Text>{error.toString()}</Text>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        height: 50,
        width: 400,
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

export default Home;
