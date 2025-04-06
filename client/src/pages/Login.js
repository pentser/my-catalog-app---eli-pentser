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
            if (!formData.user_name.trim() || !formData.password.trim()) {
                throw new Error('אנא מלא את כל השדות');
            }

            console.log('Attempting login with:', { username: formData.user_name });
            await login(formData);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            let errorMessage = 'שגיאה בהתחברות';
            
            if (err.message.includes('חיבור לשרת')) {
                errorMessage = 'לא ניתן להתחבר לשרת. אנא בדוק את החיבור לאינטרנט שלך.';
            } else if (err.message.includes('401')) {
                errorMessage = 'שם משתמש או סיסמה שגויים';
            } else if (err.message.includes('404')) {
                errorMessage = 'שירות ההתחברות אינו זמין כרגע';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>התחברות</h1>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="שם משתמש"
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
                        placeholder="סיסמה"
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
                        {loading ? <span className={styles.loading} /> : 'התחבר'}
                    </button>
                </form>
                <div className={styles.registerLink}>
                    אין לך חשבון?{' '}
                    <Link to="/register">הירשם כאן</Link>
                </div>
            </div>
        </div>
    );
};

export default Login; 