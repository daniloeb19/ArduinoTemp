interface Register {
    _id: string;
    temp: number;
    date: string;
    hour: string;
    id: string;
}

interface HomeData {
    registers: Register[];
    averageTemperature: number;
    count: number;
    maxDatesCount: number
}

interface Data {
    dates: string[];
}
