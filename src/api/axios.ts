import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_HOST, 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

