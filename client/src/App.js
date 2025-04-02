import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DeleteProducts from './pages/DeleteProducts';
import EditProducts from './pages/EditProducts';
import './App.css';

const AuthenticatedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

            <Route element={<AuthenticatedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/products/delete" element={<DeleteProducts />} />
                        <Route path="/products/edit" element={<EditProducts />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
