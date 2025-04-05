import React, { useState, useEffect } from 'react';
import { usersAPI } from '../api';
import styles from './Profile.module.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        birth_date: '',
        preferences: {
            page_size: 12
        }
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await usersAPI.getProfile();
            const userData = response.data;
            
            // המרת תאריך לפורמט המתאים לשדה input מסוג date
            const formattedDate = userData.birth_date ? new Date(userData.birth_date).toISOString().split('T')[0] : '';
            
            setProfile(userData);
            setFormData({
                ...userData,
                birth_date: formattedDate
            });
        } catch (err) {
            setError('Failed to fetch profile');
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            console.log('Submitting profile update with data:', formData);
            
            // הסרת שדות שלא צריכים להישלח לעדכון
            const { _id, user_id, user_name, status, ...updateData } = formData;
            
            // וידוא שהתאריך נשלח בפורמט הנכון
            const updatedData = {
                ...updateData,
                birth_date: new Date(updateData.birth_date).toISOString()
            };
            
            console.log('Sending update request with formatted data:', updatedData);
            const response = await usersAPI.updateProfile(updatedData);
            console.log('Update response:', response.data);
            
            setSuccess('הפרופיל עודכן בהצלחה');
            fetchProfile();
        } catch (err) {
            console.error('Error updating profile:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || 'שגיאה בעדכון הפרופיל');
        }
    };

    if (!profile) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>טעינת הפרופיל נכשלה</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>פרופיל</h1>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={styles.success}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="שם משתמש"
                        value={profile.user_name}
                        disabled
                    />
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="שם פרטי"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="שם משפחה"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        className={styles.formField}
                        placeholder="אימייל"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        className={styles.formField}
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        className={styles.formField}
                        placeholder="מוצרים בעמוד"
                        name="preferences.page_size"
                        value={formData.preferences.page_size}
                        onChange={handleChange}
                        min="1"
                        max="100"
                    />
                    <div className={`${styles.formField} ${styles.fullWidth}`}>
                        <label>
                            <input
                                type="checkbox"
                                checked={profile.status}
                                disabled
                            />
                            סטטוס חשבון
                        </label>
                    </div>
                    <div className={`${styles.formField} ${styles.fullWidth}`} style={{ textAlign: 'right' }}>
                        <button type="submit" className={styles.submitButton}>
                            שמור שינויים
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile; 