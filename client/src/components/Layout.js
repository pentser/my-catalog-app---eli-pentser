import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api';
import styles from './Layout.module.css';

const drawerWidth = 240;

const ProductForm = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        product_description: '',
        current_stock_level: 0,
        product_image: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState('');

    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImagePreview(initialData.product_image);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                if (file.size > MAX_FILE_SIZE) {
                    setImageError('גודל התמונה חייב להיות קטן מ-25MB');
                    e.target.value = ''; // נקה את שדה הקובץ
                    return;
                }
                
                setImageError(''); // נקה הודעות שגיאה קודמות
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageDataUrl = reader.result;
                    setImagePreview(imageDataUrl);
                    setFormData(prev => ({
                        ...prev,
                        product_image: imageDataUrl
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageError('');
        setFormData(prev => ({
            ...prev,
            product_image: ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!open) return null;

    return (
        <div className={styles.dialog}>
            <h2 className={styles.dialogTitle}>הוסף מוצר חדש</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.dialogContent}>
                    <input
                        className={styles.formField}
                        placeholder="שם המוצר"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        className={styles.formField}
                        placeholder="תיאור המוצר"
                        name="product_description"
                        value={formData.product_description}
                        onChange={handleChange}
                        rows={4}
                        required
                    />
                    <input
                        className={styles.formField}
                        type="number"
                        placeholder="כמות במלאי"
                        name="current_stock_level"
                        value={formData.current_stock_level}
                        onChange={handleChange}
                        required
                    />
                    <div className={styles.imageUploadSection}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className={styles.imageInput}
                            id="product-image"
                        />
                        <label htmlFor="product-image" className={styles.imageInputLabel}>
                            {imagePreview ? 'שנה תמונה' : 'העלה תמונה (עד 25MB)'}
                        </label>
                        {imageError && <div className={styles.imageError}>{imageError}</div>}
                    </div>
                    {imagePreview && (
                        <>
                            <div className={styles.imagePreview}>
                                <img src={imagePreview} alt="תצוגה מקדימה" />
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className={styles.removeImageButton}
                            >
                                הסר תמונה
                            </button>
                        </>
                    )}
                </div>
                <div className={styles.dialogActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        ביטול
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        הוסף
                    </button>
                </div>
            </form>
        </div>
    );
};

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim()) {
            setSearchParams({ search: value.trim() });
            navigate('/', { state: { search: value.trim() } });
        } else {
            setSearchParams({});
            navigate('/', { state: { search: '' } });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ search: searchQuery.trim() });
            navigate('/');
        } else {
            setSearchParams({});
            navigate('/');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateProduct = async (formData) => {
        try {
            const productData = {
                ...formData,
                product_id: Date.now()
            };
            await productsAPI.create(productData);
            setSuccess('המוצר נוצר בהצלחה');
            setOpenDialog(false);
            navigate('/');
        } catch (err) {
            console.error('Error creating product:', err);
            setError('שגיאה ביצירת המוצר');
        }
    };

    const menuItems = [
        { text: 'מוצרים', icon: '🛍️', path: '/' },
        { text: 'פרופיל', icon: '👤', path: '/profile' },
        ...(user?.isAdmin ? [
            { text: 'הוסף מוצר', icon: '➕', action: () => setOpenDialog(true) },
            { text: 'לוח בקרה', icon: '📊', path: '/admin' },
            { text: 'עריכת מוצרים', icon: '✏️', path: '/products/edit' },
            { text: 'מחיקת מוצרים', icon: '🗑️', path: '/products/delete' }
        ] : [])
    ];

    return (
        <div className={styles.layout}>
            <header className={styles.appBar}>
                <button className={styles.menuButton} onClick={handleDrawerToggle}>
                    ☰
                </button>
                {user && (
                    <span className={styles.welcomeMessage}>שלום, {user.first_name}</span>
                )}
                <div className={styles.toolbar}>
                    {user && (
                        <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleLogout}>
                            התנתק
                        </button>
                    )}
                </div>
            </header>

            <nav className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.searchBox}>
                    <form onSubmit={handleSearch} className={styles.searchInput}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="חיפוש מוצרים..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>
                <div className={styles.menu}>
                    {menuItems.map((item) => (
                        <div
                            key={item.text}
                            className={`${styles.menuItem} ${location.pathname === item.path ? styles.selected : ''}`}
                            onClick={item.action || (() => navigate(item.path))}
                        >
                            <span className={styles.menuIcon}>{item.icon}</span>
                            <span className={styles.menuText}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </nav>

            <main className={styles.main}>
                {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
                {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}
                <Outlet />
            </main>

            <ProductForm
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleCreateProduct}
                initialData={null}
            />
        </div>
    );
};

export default Layout; 