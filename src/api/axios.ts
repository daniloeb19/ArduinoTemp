import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.2:8080', 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

