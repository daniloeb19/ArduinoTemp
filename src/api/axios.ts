import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://back-t6au.onrender.com', 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

