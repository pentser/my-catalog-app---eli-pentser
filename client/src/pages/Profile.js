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
            setProfile(response.data);
            setFormData(response.data);
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
        try {
            await usersAPI.updateProfile(formData);
            setSuccess('Profile updated successfully');
            fetchProfile();
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (!profile) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Profile</h1>

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
                        placeholder="Username"
                        value={profile.user_name}
                        disabled
                    />
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        className={styles.formField}
                        placeholder="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        className={styles.formField}
                        placeholder="Email"
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
                        placeholder="Products per Page"
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
                            Account Status
                        </label>
                    </div>
                    <div className={`${styles.formField} ${styles.fullWidth}`} style={{ textAlign: 'right' }}>
                        <button type="submit" className={styles.submitButton}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile; 