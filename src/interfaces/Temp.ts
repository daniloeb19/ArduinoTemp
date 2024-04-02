export interface Register {
    _id: string;
    temp: number;
    date: string;
    hour: string;
    id: string;
}

export interface Data {
    dates: string[];
}


export interface HomeData {
    registers: Register[];
    averageTemperature: number;
    count: number;
    maxDatesCount: number;
    max: {
        temp: number;
        date: string;
        hour: string;
    };
    min: {
        temp: number;
        date: string;
        hour: string;
    };
}
