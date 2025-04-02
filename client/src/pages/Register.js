import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        password: '',
        first_name: '',
        last_name: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
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
            await register(formData);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Register</h1>
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
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <input
                        type="email"
                        className={styles.formField}
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? <span className={styles.loading} /> : 'Register'}
                    </button>
                </form>
                <div className={styles.loginLink}>
                    Already have an account?{' '}
                    <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register; 