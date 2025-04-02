import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Welcome to My Catalog App</h1>
                <p className={styles.subtitle}>Your one-stop shop for managing products</p>
                {!user ? (
                    <div className={styles.authButtons}>
                        <Link to="/login" className={styles.button}>
                            Login
                        </Link>
                        <Link to="/register" className={`${styles.button} ${styles.primaryButton}`}>
                            Register
                        </Link>
                    </div>
                ) : (
                    <Link to="/products" className={`${styles.button} ${styles.primaryButton}`}>
                        View Products
                    </Link>
                )}
            </div>

            <div className={styles.features}>
                <div className={styles.feature}>
                    <h2 className={styles.featureTitle}>Product Management</h2>
                    <p className={styles.featureDescription}>
                        Easily manage your product catalog with our intuitive interface.
                    </p>
                </div>
                <div className={styles.feature}>
                    <h2 className={styles.featureTitle}>Search & Filter</h2>
                    <p className={styles.featureDescription}>
                        Find products quickly with our powerful search and filter capabilities.
                    </p>
                </div>
                <div className={styles.feature}>
                    <h2 className={styles.featureTitle}>User Profiles</h2>
                    <p className={styles.featureDescription}>
                        Customize your experience with personalized user profiles.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home; 