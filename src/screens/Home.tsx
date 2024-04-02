import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { axiosInstance } from '../api/axios';
import Loading from '../components/Loading';
import { Picker } from '@react-native-picker/picker';
import { formatDateToDDMMYYYY } from '../util/Dates';
import { Data, HomeData } from '../interfaces/Temp';
import { Button } from 'react-native-elements';

const Home: React.FC = () => {
    const [loadingState, setLoadingState] = useState<"error" | "ok" | "loading">("loading");
    const [responseData, setResponseData] = useState<HomeData>();
    const [dateData, setDateData] = useState<Data>();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedNumber, setSelectedNumber] = useState<number>(10);
    const [error, setError] = useState<string>("");
    const [reload, setReload] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingState("loading");

            await axiosInstance.get<Data>('available').then((response) => {
                setDateData(response.data);
                setSelectedDate(response.data.dates[response.data.dates.length - 1]);
                setLoadingState("ok");
            }).catch((error) => {
                handleFetchError(error);
            })
        };
        fetchData();
    }, [reload]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingState("loading");

            await axiosInstance.get<HomeData>(`temp/date/${selectedDate}/${selectedNumber}`).then((response) => {
                setResponseData(response.data);
                setLoadingState("ok");
            }).catch((error) => {
                handleFetchError(error);
            })
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonReloadContainer: {
            width: '100%',
        },
        buttonReload: {
            color: "white",
            backgroundColor: "black",
            height: 50,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        dropdown: {
            height: 50,
            width: 400,
        },
        center: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        leftContainer: {
            alignItems: "flex-start"
        },
        data: {
            fontSize: 24,
            fontWeight: 'bold',
            margin:8
        },
        flex:{
            justifyContent: "space-evenly",
            display: "flex",
            flexDirection: "row"
        }
    });

    return (
        <View style={styles.container} >
            <View style={styles.buttonReloadContainer}>
                <Button
                    title="Recarregar"
                    buttonStyle={styles.buttonReload}
                    onPress={() => setReload((prev) => prev + 1)}
                />
            </View>
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

                {loadingState !== "loading" && dateData && responseData && (
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
                <View style={styles.leftContainer}>
                    {loadingState !== "loading" && responseData && dateData && (
                        <View>
                            <Text style={styles.data}>
                                Média: {responseData.averageTemperature && responseData.averageTemperature?.toFixed(2)}°C
                            </Text>
                        </View>
                    )}
                    {loadingState !== "loading" && responseData && dateData && (
                        <View style={styles.flex}>
                            <Text style={styles.data}>
                                Min: {responseData.min && responseData.min?.temp.toFixed(2)}°C
                            </Text>
                            <Text style={styles.data}>
                                Hora: {responseData.min && responseData.min?.hour}
                            </Text>
                        </View>
                    )}
                    {loadingState !== "loading" && responseData && dateData && (
                        <View style={styles.flex}>
                            <Text style={styles.data}>
                                Max: {responseData.max && responseData.max.temp?.toFixed(2)}°C
                            </Text>
                            <Text style={styles.data}>
                                Hora: {responseData.max && responseData.max.hour}
                            </Text>
                        </View>
                    )}
                </View>
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



export default Home;
