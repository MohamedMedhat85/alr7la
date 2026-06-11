import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const requestLogger = (config: InternalAxiosRequestConfig) => {
    console.log('Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
    });
    return config;
};

export const responseLogger = (response: AxiosResponse) => {
    console.log('Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
    });
    return response;
};

export const errorLogger = (error: any) => {
    console.error('Error:', {
        message: error.message,
        response: error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
        } : null,
    });
    return Promise.reject(error);
}; 