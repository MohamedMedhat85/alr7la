import axios, { AxiosInstance } from 'axios';
import authInterceptor from './authInterceptor';
import { requestLogger, responseLogger, errorLogger } from './loggingInterceptor';

const BASE_URL = 'https://alr7la-backend-production-ff41.up.railway.app';
//const BASE_URL = 'http://localhost:3000';
const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
}); 

// Add interceptors
api.interceptors.request.use(authInterceptor);
api.interceptors.request.use(requestLogger);
api.interceptors.response.use(responseLogger, errorLogger);

// Upload Services
export const uploadService = {
    uploadProfilePicture: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload/profilePicture', formData);
    },

    uploadWallpaper: (file: File) => {
        const formData = new FormData();
        console.log("file:",file);
        formData.append('file', file);
        return api.post('/upload/wallpaper', formData);
    },
};
