import axios from 'axios';

// קביעת כתובת ה-API מתוך משתני הסביבה
const baseURL = process.env.REACT_APP_API_URL;

console.log('API Base URL:', baseURL);
console.log('Environment:', process.env.REACT_APP_ENV);

// יצירת מופע axios עם הגדרות בסיסיות
const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// הוספת interceptor לטיפול בטוקן ולוגים
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request Config:', {
        url: config.url,
        baseURL: config.baseURL,
        method: config.method,
        headers: config.headers
    });
    return config;
});

// הוספת interceptor לטיפול בשגיאות
api.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            config: error.config,
            response: error.response
        });
        return Promise.reject(error);
    }
);

// Products API
export const productsAPI = {
    getAll: (page) => api.get(`/products?page=${page}`),
    search: (query, page) => api.get(`/products/search?query=${query}&page=${page}`),
    getStats: () => api.get('/products/stats')
};

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    getStats: () => api.get('/users/stats'),
    getAllUsers: () => api.get('/users'),
    updateStatus: (id, status) => api.put(`/users/${id}/status`, { status }),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData)
};

export default api; 