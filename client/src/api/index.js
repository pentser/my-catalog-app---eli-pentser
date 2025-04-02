import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};

// Products API
export const productsAPI = {
    getAll: (page = 1, limit = 12) => api.get(`/products?page=${page}&limit=${limit}`),
    getById: (id) => api.get(`/products/${id}`),
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    delete: (id) => api.delete(`/products/${id}`),
    search: (query, page = 1, limit = 12) => 
        api.get(`/products/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
};

// Users API
export const usersAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    getAll: () => api.get('/users'),
    updateStatus: (id, status) => api.put(`/users/${id}/status`, { status }),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData)
};

export default api; 