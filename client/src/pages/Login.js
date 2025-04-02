import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login(formData);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Login</h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="Username"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                        autoFocus
                        disabled={loading}
                    />
                    <input
                        type="password"
                        className={styles.formField}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? <span className={styles.loading} /> : 'Login'}
                    </button>
                </form>
                <div className={styles.registerLink}>
                    Don't have an account?{' '}
                    <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login; 