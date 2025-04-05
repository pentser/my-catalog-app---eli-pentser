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
    const [errors, setErrors] = useState({
        product_name: '',
        product_description: '',
        current_stock_level: '',
        product_image: ''
    });

    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
    const MIN_NAME_LENGTH = 2;
    const MAX_NAME_LENGTH = 50;
    const MIN_DESCRIPTION_LENGTH = 10;
    const MAX_DESCRIPTION_LENGTH = 500;
    const MIN_STOCK = 0;
    const MAX_STOCK = 9999;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
    const MAX_IMAGE_WIDTH = 2000;
    const MAX_IMAGE_HEIGHT = 2000;
    const MIN_IMAGE_WIDTH = 100;
    const MIN_IMAGE_HEIGHT = 100;

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImagePreview(initialData.product_image);
        }
    }, [initialData]);

    const validateName = (name) => {
        if (name.length < MIN_NAME_LENGTH) {
            return `שם המוצר חייב להכיל לפחות ${MIN_NAME_LENGTH} תווים`;
        }
        if (name.length > MAX_NAME_LENGTH) {
            return `שם המוצר לא יכול להכיל יותר מ-${MAX_NAME_LENGTH} תווים`;
        }
        if (!/^[\u0590-\u05FFa-zA-Z0-9\s-_]+$/.test(name)) {
            return 'שם המוצר יכול להכיל רק אותיות בעברית, אנגלית, מספרים ומקפים';
        }
        return '';
    };

    const validateDescription = (description) => {
        if (description.length < MIN_DESCRIPTION_LENGTH) {
            return `תיאור המוצר חייב להכיל לפחות ${MIN_DESCRIPTION_LENGTH} תווים`;
        }
        if (description.length > MAX_DESCRIPTION_LENGTH) {
            return `תיאור המוצר לא יכול להכיל יותר מ-${MAX_DESCRIPTION_LENGTH} תווים`;
        }
        return '';
    };

    const validateStock = (stock) => {
        const stockNum = Number(stock);
        if (isNaN(stockNum)) {
            return 'כמות המלאי חייבת להיות מספר';
        }
        if (stockNum < MIN_STOCK) {
            return 'כמות המלאי לא יכולה להיות שלילית';
        }
        if (stockNum > MAX_STOCK) {
            return `כמות המלאי לא יכולה להיות גדולה מ-${MAX_STOCK}`;
        }
        if (!Number.isInteger(stockNum)) {
            return 'כמות המלאי חייבת להיות מספר שלם';
        }
        return '';
    };

    const validateImage = async (file) => {
        if (!file) return '';
        
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return 'ניתן להעלות רק תמונות מסוג JPG, PNG או GIF';
        }

        if (file.size > MAX_FILE_SIZE) {
            return 'גודל התמונה חייב להיות קטן מ-25MB';
        }

        // בדיקת מימדי התמונה
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
                    resolve(`מימדי התמונה חייבים להיות קטנים מ-${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT} פיקסלים`);
                } else if (img.width < MIN_IMAGE_WIDTH || img.height < MIN_IMAGE_HEIGHT) {
                    resolve(`מימדי התמונה חייבים להיות לפחות ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT} פיקסלים`);
                } else {
                    resolve('');
                }
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                const imageError = await validateImage(file);
                if (imageError) {
                    setErrors(prev => ({ ...prev, product_image: imageError }));
                    e.target.value = '';
                    return;
                }

                setErrors(prev => ({ ...prev, product_image: '' }));
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
            let error = '';
            switch (name) {
                case 'product_name':
                    error = validateName(value);
                    break;
                case 'product_description':
                    error = validateDescription(value);
                    break;
                case 'current_stock_level':
                    error = validateStock(value);
                    break;
            }

            setErrors(prev => ({ ...prev, [name]: error }));
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setErrors(prev => ({ ...prev, product_image: '' }));
        setFormData(prev => ({
            ...prev,
            product_image: ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // בדיקת וולידציה לפני שליחה
        const nameError = validateName(formData.product_name);
        const descError = validateDescription(formData.product_description);
        const stockError = validateStock(formData.current_stock_level);

        const newErrors = {
            product_name: nameError,
            product_description: descError,
            current_stock_level: stockError,
            product_image: errors.product_image
        };

        setErrors(newErrors);

        // אם יש שגיאות, לא שולחים את הטופס
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }

        onSubmit(formData);
    };

    if (!open) return null;

    return (
        <div className={styles.dialog}>
            <h2 className={styles.dialogTitle}>הוסף מוצר חדש</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.dialogContent}>
                    <div className={styles.formGroup}>
                        <input
                            className={`${styles.formField} ${errors.product_name ? styles.errorField : ''}`}
                            placeholder="שם המוצר"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            minLength={MIN_NAME_LENGTH}
                            maxLength={MAX_NAME_LENGTH}
                            required
                        />
                        {errors.product_name && <div className={styles.errorText}>{errors.product_name}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <textarea
                            className={`${styles.formField} ${errors.product_description ? styles.errorField : ''}`}
                            placeholder="תיאור המוצר"
                            name="product_description"
                            value={formData.product_description}
                            onChange={handleChange}
                            rows={4}
                            minLength={MIN_DESCRIPTION_LENGTH}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            required
                        />
                        {errors.product_description && <div className={styles.errorText}>{errors.product_description}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            className={`${styles.formField} ${errors.current_stock_level ? styles.errorField : ''}`}
                            type="number"
                            placeholder="כמות במלאי"
                            name="current_stock_level"
                            value={formData.current_stock_level}
                            onChange={handleChange}
                            min={MIN_STOCK}
                            max={MAX_STOCK}
                            required
                        />
                        {errors.current_stock_level && <div className={styles.errorText}>{errors.current_stock_level}</div>}
                    </div>

                    <div className={styles.imageUploadSection}>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif"
                            onChange={handleChange}
                            className={styles.imageInput}
                            id="product-image"
                        />
                        <label htmlFor="product-image" className={styles.imageInputLabel}>
                            {imagePreview ? 'שנה תמונה' : 'העלה תמונה (JPG, PNG או GIF עד 25MB)'}
                        </label>
                        {errors.product_image && <div className={styles.errorText}>{errors.product_image}</div>}
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
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={Object.values(errors).some(error => error !== '')}
                    >
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