import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        stock: 0,
        isActive: true
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await productsAPI.getById(id);
            setProduct(data);
            setEditForm({
                name: data.name,
                description: data.description,
                stock: data.stock,
                isActive: data.isActive
            });
        } catch (err) {
            setError('שגיאה בטעינת פרטי המוצר');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await productsAPI.update(id, editForm);
            setIsEditing(false);
            fetchProduct();
        } catch (err) {
            setError('שגיאה בעדכון המוצר');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!product) return <div className={styles.loading}>טוען...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/products')}>
                    חזרה למוצרים
                </button>
                <button className={styles.editButton} onClick={handleEdit}>
                    ערוך מוצר
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.productCard}>
                <h1 className={styles.productTitle}>{product.name}</h1>
                <p className={styles.productId}>מזהה: {product.id}</p>

                <div className={styles.grid}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>תיאור</h2>
                        <p className={styles.sectionContent}>{product.description}</p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>מלאי</h2>
                        <p className={styles.sectionContent}>{product.stock} יחידות</p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>סטטוס</h2>
                        <p className={`${styles.sectionContent} ${styles.status} ${product.isActive ? styles.statusActive : styles.statusInactive}`}>
                            {product.isActive ? 'פעיל' : 'לא פעיל'}
                        </p>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className={styles.dialog}>
                    <h2 className={styles.dialogTitle}>עריכת מוצר</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className={styles.dialogContent}>
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleChange}
                                className={styles.formField}
                                placeholder="שם המוצר"
                            />
                            <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleChange}
                                className={styles.formField}
                                placeholder="תיאור המוצר"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={editForm.stock}
                                onChange={handleChange}
                                className={styles.formField}
                                placeholder="כמות במלאי"
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={editForm.isActive}
                                    onChange={handleChange}
                                />
                                פעיל
                            </label>
                        </div>
                        <div className={styles.dialogActions}>
                            <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                                ביטול
                            </button>
                            <button type="submit" className={styles.saveButton}>
                                שמור
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductDetails; 