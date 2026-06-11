import { InternalAxiosRequestConfig } from 'axios';

const authInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

export default authInterceptor; 