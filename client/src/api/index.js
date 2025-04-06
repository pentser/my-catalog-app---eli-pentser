import axios from 'axios';

// קביעת כתובת ה-API בהתאם לסביבה
const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://catalog-app-b6cx9.ondigitalocean.app/api'
    : 'http://localhost:5000/api';

// יצירת מופע axios עם הגדרות בסיסיות
const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// הוספת interceptor לטיפול בטוקן
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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