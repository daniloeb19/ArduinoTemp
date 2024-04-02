export interface Register {
    _id: string;
    temp: number;
    date: string;
    hour: string;
    id: string;
}

export interface HomeData {
    registers: Register[];
    averageTemperature: number;
    count: number;
    maxDatesCount: number;
    minTemperatura: number;
	maxTemperatura: number;
}

export interface Data {
    dates: string[];
}
