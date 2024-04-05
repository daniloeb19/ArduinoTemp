import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { axiosInstance } from '../api/axios';
import Loading from '../components/Loading';
import { Picker } from '@react-native-picker/picker';
import { formatDateToDDMMYYYY } from '../util/Dates';
import { Data, HomeData } from '../interfaces/Temp';
import { Button } from 'react-native-elements';
import { Dimensions } from 'react-native';
import {
    TouchableWithoutFeedback
} from 'react-native';
import SyncStorage from 'sync-storage';

const Home: React.FC = () => {
    const [loadingState, setLoadingState] = useState<"error" | "ok" | "loading">("loading");
    const [responseData, setResponseData] = useState<HomeData>();
    const [dateData, setDateData] = useState<Data>();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedNumber, setSelectedNumber] = useState<number>(10);
    const [error, setError] = useState<string>("");
    const [reload, setReload] = useState<number>(0);
    const colors = [
        { background: '#6874e7', text: '#FFFFFF' },
        { background: '#b8304f', text: '#FFFFFF' },
        { background: '#758E4F', text: '#000000' },
        { background: '#fa3741', text: '#FFFFFF' },
        { background: '#F26419', text: '#FFFFFF' },
        { background: '#F6AE2D', text: '#000000' },
        { background: '#DFAEB4', text: '#000000' },
        { background: '#7A93AC', text: '#000000' },
        { background: '#33658A', text: '#FFFFFF' },
        { background: '#3d2b56', text: '#FFFFFF' },
        { background: '#42273B', text: '#FFFFFF' },
        { background: '#171A21', text: '#FFFFFF' },
        { background: '#E52B50', text: '#FFFFFF' },
        { background: '#FFBF00', text: '#000000' },
        { background: '#9966CC', text: '#000000' },
        { background: '#FBCEB1', text: '#000000' },
        { background: '#7FFFD4', text: '#000000' },
        { background: '#50C878', text: '#000000' },
        { background: '#6B8E23', text: '#000000' },
        { background: '#4682B4', text: '#000000' },
        { background: '#B0C4DE', text: '#000000' }
    ]
        ;


    const CIRCLE_SIZE = 40;
    const CIRCLE_RING_SIZE = 2;
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        setValue(SyncStorage.get('color-temp') || 0);
    }, [SyncStorage]);


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
            width: "auto",
            height: "100%",
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        containerEnd: {
            width: "auto",
            backgroundColor: colors[value].background,
            color: colors[value].text,
            marginTop: "auto",
        },
        loading: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonReloadContainer: {
            width: '100%',
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        buttonReload: {
            width: "100%",
            color: "white",
            backgroundColor: "#000000",
            height: 50,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        dropdown: {
            height: 50,
            width: 400,
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        center: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        leftContainer: {
            alignItems: "flex-start",
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        data: {
            fontSize: 24,
            fontWeight: 'bold',
            margin: 8,
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        flex: {
            justifyContent: "space-evenly",
            display: "flex",
            flexDirection: "row",
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },
        group: {
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 12,
            backgroundColor: colors[value].background,
            color: colors[value].text,
        },

        placeholder: {
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            height: 400,
            marginTop: 0,
            padding: 24,
            backgroundColor: 'transparent',
        },
        circle: {
            width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
            height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
            borderRadius: 9999,
            backgroundColor: 'white',
            borderWidth: CIRCLE_RING_SIZE,
            borderColor: 'transparent',
            marginRight: 8,
            marginBottom: 12,
        },
        circleInside: {
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: 9999,
            position: 'absolute',
            top: CIRCLE_RING_SIZE,
            left: CIRCLE_RING_SIZE,
        },
        btn: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            padding: 14,
            borderWidth: 1,
            borderColor: '#000',
            backgroundColor: '#000',
            marginBottom: 12,
        },
        btnText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#fff',
        },
    });


    const showError = () => {
        Alert.alert(
            'Error',
            error,
            [{
                onPress() {
                    setError("");
                    setReload((prev) => prev + 1);
                    setLoadingState("loading");
                },
                text: 'Recarregar',
                style: 'destructive',
            },])
    };

    return (
        <View style={styles.container} >
            <View style={styles.buttonReloadContainer}>
                <Button
                    title="Recarregar"
                    buttonStyle={styles.buttonReload}
                    onPress={() => setReload((prev) => prev + 1)}
                />
            </View>
            <View style={styles.leftContainer}>

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
                    <View style={styles.loading}>
                        <View style={styles.center}>
                            <Loading />
                        </View>
                    </View>
                )
            }

            {error !== "" && (<View>
                <>{showError()}</>
            </View>)}

            <View style={styles.containerEnd}>
                <View style={styles.group}>
                    {colors.map((item, index) => {
                        const isActive = value === index;
                        return (
                            <View key={item.background}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setValue(index);
                                        SyncStorage.set('color-temp', index);

                                    }}>
                                    <View
                                        style={[
                                            styles.circle,
                                            isActive && { borderColor: item.background },
                                        ]}>
                                        <View
                                            style={[styles.circleInside, { backgroundColor: item.background }]}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View >
    );
};


export default Home;
