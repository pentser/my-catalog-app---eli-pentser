import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, usersAPI } from '../api';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        activeProducts: 0
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsResponse, usersResponse] = await Promise.all([
                productsAPI.getAll(1),
                usersAPI.getAllUsers()
            ]);

            const products = productsResponse.data.products || [];
            const users = usersResponse.data || [];

            setStats({
                totalProducts: productsResponse.data.totalProducts || 0,
                totalUsers: users.length,
                activeProducts: products.filter(p => p.status).length
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('שגיאה בטעינת נתוני לוח הבקרה');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>לוח בקרה למנהל</h1>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3 className={styles.statTitle}>סה"כ מוצרים</h3>
                    <p className={styles.statValue}>{stats.totalProducts}</p>
                </div>
                <div className={styles.statCard}>
                    <h3 className={styles.statTitle}>מוצרים פעילים</h3>
                    <p className={styles.statValue}>{stats.activeProducts}</p>
                </div>
                <div className={styles.statCard}>
                    <h3 className={styles.statTitle}>סה"כ משתמשים</h3>
                    <p className={styles.statValue}>{stats.totalUsers}</p>
                </div>
            </div>

            <div className={styles.actionsGrid}>
                <Link to="/" className={styles.actionCard}>
                    <h2 className={styles.actionTitle}>ניהול מוצרים</h2>
                    <p className={styles.actionDescription}>
                        הוסף, ערוך או מחק מוצרים מהמערכת
                    </p>
                </Link>
                <Link to="/products/delete" className={styles.actionCard}>
                    <h2 className={styles.actionTitle}>מחיקת מוצרים</h2>
                    <p className={styles.actionDescription}>
                        מחק מוצרים מהמערכת
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard; 