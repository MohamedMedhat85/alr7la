import axios, { AxiosInstance } from 'axios';
import authInterceptor from './authInterceptor';
import { requestLogger, responseLogger, errorLogger } from './loggingInterceptor';

const BASE_URL = 'https://alr7la-backend-production-ff41.up.railway.app/';


const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create a separate instance for file uploads
const uploadApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Add interceptors to main api
api.interceptors.request.use(authInterceptor);
api.interceptors.request.use(requestLogger);
api.interceptors.response.use(responseLogger, errorLogger);

// Add auth interceptor to upload api
uploadApi.interceptors.request.use(authInterceptor);

// Auth Services
export const authService = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (userData: any) =>
        api.post('/auth', userData),

    refreshToken: () =>
        api.post('/auth/refreshToken'),

    sendOTP: (email: string) =>
        api.post(`/auth/send-otp/${email}`),

    verifyOTP: (email: string, otp: string, newPassword: string) =>
        api.post('/auth/verify-otp', { email, otp, newPassword }),
};

// Comments Services
export const commentService = {
    createComment: (postId: string, description: string, comment_parent_id?: string) =>
        api.post(`/comments/posts/${postId}`, { description, comment_parent_id }),

    getComments: (postId: string, page?: number, limit?: number) =>
        api.get(`/comments/posts/${postId}`, { params: { page, limit } }),

    updateComment: (commentId: string, description: string) =>
        api.put(`/comments/${commentId}`, { description }),

    deleteComment: (commentId: string) =>
        api.delete(`/comments/${commentId}`),
};

// Posts Services
export const postService = {
    createPost: (formData: FormData) =>
        uploadApi.post('/posts/create-post', formData),

    updatePost: (postId: string, description: string, visibility: string) =>
        api.put(`/posts/update-post/${postId}`, { description, visibility }),

    deletePost: (postId: string) =>
        api.delete(`/posts/delete-post/${postId}`),

    toggleLike: (postId: string) =>
        api.post(`/posts/${postId}/like`),

    getUserPosts: (userId: string, { limit, offset }: { limit: number, offset: number }) =>
        api.get(`/posts/user/${userId}?limit=${limit}&offset=${offset}`),

    getSavedPosts: () =>
        api.get('/posts/saved-posts'),

    toggleSave: (postId: string) =>
        api.post(`/posts/toggle-save/${postId}`),
};

// Friends Services
export const friendService = {
    getFriends: (userId: string) =>
        api.get(`/friends/get-friends/${userId}`),

    getFriendRequests: () =>
        api.get('/friends/friendRequests'),

    updateFriendRequest: (user_id: Int16Array, status: 'accepted' | 'rejected') =>
        api.put('/friends/friendRequests', { user_id, status }),

    removeFriend: (friendId: string) =>
        api.delete(`/friends/remove-friend/${friendId}`),

    addFriend: (friendId: string) =>
        api.post('/friends/add-friend', { friendId }),

    cancelFriendRequest: (friendId: string) =>
        api.delete(`/friends/cancel-friend-request/${friendId}`),

    checkFriendshipStatus: (friendId: string) =>
        api.get(`/friends/check-status/${friendId}`),
    getFriendSuggestions: () =>
        api.get('/friends/friend-suggestions'),
    getMutualFriendsCount: (userId: string) =>
        api.get(`/friends/mutual-friends-count/${userId}`),


};

// Profile Services
export const profileService = {
    getProfile: (userId: string) =>
        api.get(`/profile/${userId}`),

    updateProfile: (profileData: any) =>
        api.put('/profile/edit-profile', profileData),
};

// Trip Services
export const tripService = {
    getTravelInfo: (travelData: any) =>
        api.post('/trip/travel-info', travelData),

    createTrip: (tripData: any) =>
        api.post('/trip/', tripData),

    getTrip: (tripId: number) =>
        api.get(`/trip/${tripId}`),

    updateTrip: (tripId: number, tripData: any) =>
        api.put(`/trip/trips/${tripId}`, tripData),
    deleteTrip: (tripId: number) =>
        api.delete(`/trip/user/${tripId}`),

    getUserTrips: (userId: string) =>
        api.get(`/trip/user/${userId}`),
};

// Feed Services
export const feedService = {
    getFeed: (userId: string) =>
        api.get(`/feed/${userId}`),

    recordInteraction: (postId: string, interactionType: string) =>
        api.post('/feed/interactions', { postId, interactionType }),
};

// Places Services
export const placeService = {
    createPlace: (placeData: any) =>
        api.post('/places', placeData),

    getAllPlaces: () =>
        api.get('/places'),

    getPlacesByCountry: (country: string) =>
        api.get(`/places/country/${country}`),

    getPlace: (id: string) =>
        api.get(`/places/${id}`),

    updatePlace: (id: string, placeData: any) =>
        api.put(`/places/${id}`, placeData),

    deletePlace: (id: string) =>
        api.delete(`/places/${id}`),

    searchPlacesByName: (name: string) =>
        api.get(`/places?name=${encodeURIComponent(name)}`),
};

// Reviews Services
export const reviewService = {
    createReview: (placeId: string, description: string, rating: number) =>
        api.post(`/reviews/places/${placeId}`, { description, rating }),

    getReviews: (placeId: string, page?: number, limit?: number) =>
        api.get(`/reviews/places/${placeId}`, { params: { page, limit } }),

    getUserReviews: (userId: string, page?: number, limit?: number) =>
        api.get(`/reviews/users/${userId}`, { params: { page, limit } }),

    updateReview: (reviewId: string, description: string, rating: number) =>
        api.put(`/reviews/${reviewId}`, { description, rating }),

    deleteReview: (reviewId: string) =>
        api.delete(`/reviews/${reviewId}`),
};

// Visited Countries Services
export const visitedCountryService = {
    getVisitedCountries: (userId: string) =>
        api.get(`/visited-countries/${userId}`),

    addVisitedCountry: (countryId: number, visitDate?: string) =>
        api.post('/visited-countries', { country_id: countryId, visit_date: visitDate }),

    deleteVisitedCountry: (countryId: number) =>
        api.delete(`/visited-countries/${countryId}`),
};

// Weather Services
export const weatherService = {
    getWeather: (city: string) =>
        api.get(`/weather/${city}`),
};

// Upload Services
export const uploadService = {
    uploadProfilePicture: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Uploading profile picture:', file.name, file.size, file.type);
        console.log('FormData entries:', Array.from(formData.entries()));
        return uploadApi.post('/upload/profilePicture', formData);
    },

    uploadWallpaper: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Uploading wallpaper:', file.name, file.size, file.type);
        console.log('FormData entries:', Array.from(formData.entries()));
        return uploadApi.post('/upload/wallpaper', formData);
    },

    deleteProfilePicture: () => {
        return uploadApi.delete('/upload/profilePicture');
    },

    deleteWallpaper: () => {
        return uploadApi.delete('/upload/wallpaper');
    },
};

// Visa Services
export const visaService = {
    getVisaRequirements: (source: string, destination: string) =>
        api.get(`/visa/${source}/${destination}`),
};

// Country Services
export const countryService = {
    getCountryById: (countryId: string) =>
        api.get(`/countries/${countryId}`),

    getAllCountries: (params?: { limit?: number; offset?: number; search?: string }) =>
        api.get('/countries', { params }),

    getCountryStats: (countryId: string) =>
        api.get(`/countries/${countryId}/stats`),
};

// Packing List Services
export const packingListService = {
    getPackingList: (userId: string, tripId: string) =>
        api.get(`/packing-list/user/${userId}/trip/${tripId}`),

    updatePackingList: (userId: string, tripId: string, sections: any) =>
        api.put(`/packing-list/user/${userId}/trip/${tripId}`, { sections }),

    deletePackingList: (userId: string, tripId: string) =>
        api.delete(`/packing-list/user/${userId}/trip/${tripId}`),
};

export { api };
