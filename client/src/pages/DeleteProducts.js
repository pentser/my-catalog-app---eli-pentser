import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './DeleteProducts.module.css';

const DeleteProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchId) {
            const filtered = products.filter(product => 
                product.product_id.toString().includes(searchId)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchId, products]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // בדיקה אם התגובה מגיעה בפורמט הנכון
            const productsData = response.data.products || response.data;
            if (Array.isArray(productsData)) {
                setProducts(productsData);
            } else {
                setError('פורמט נתונים לא תקין מהשרת');
                console.error('Invalid data format:', productsData);
            }
        } catch (err) {
            setError('שגיאה בטעינת המוצרים');
            console.error('Error fetching products:', err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchId(e.target.value);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
            } catch (err) {
                setError('שגיאה במחיקת המוצר');
                console.error('Error deleting product:', err);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>מחיקת מוצרים</h1>
                <Link to="/admin" className={styles.backButton}>חזרה ללוח הבקרה</Link>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {/* <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="חיפוש לפי מזהה מוצר..."
                    value={searchId}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div> */}

            <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                    <div key={product.product_id} className={styles.productCard}>
                        <div className={styles.productInfo}>
                            <h3 className={styles.productTitle}>{product.product_name}</h3>
                            <p className={styles.productDescription}>{product.description}</p>
                            <p className={styles.productStock}>מלאי: {product.stock_level}</p>
                            <p className={styles.productStatus}>
                                סטטוס: {product.is_active ? 'פעיל' : 'לא פעיל'}
                            </p>
                        </div>
                        <div className={styles.productActions}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(product.product_id)}
                            >
                                מחק מוצר
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeleteProducts; 