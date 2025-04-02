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
        current_stock_level: 0
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!open) return null;

    return (
        <div className={styles.dialog}>
            <h2 className={styles.dialogTitle}>{initialData ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.dialogContent}>
                    <input
                        className={styles.formField}
                        placeholder="Product Name"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        className={styles.formField}
                        placeholder="Description"
                        name="product_description"
                        value={formData.product_description}
                        onChange={handleChange}
                        rows={4}
                        required
                    />
                    <input
                        className={styles.formField}
                        type="number"
                        placeholder="Stock Level"
                        name="current_stock_level"
                        value={formData.current_stock_level}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.dialogActions}>
                    <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                        {initialData ? 'Update' : 'Add'}
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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

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
            setSuccess('Product created successfully');
            setOpenDialog(false);
            navigate('/');
        } catch (err) {
            console.error('Error creating product:', err);
            setError('Failed to create product');
        }
    };

    const handleUpdateProduct = async (formData) => {
        try {
            await productsAPI.update(selectedProduct.product_id, formData);
            setSuccess('Product updated successfully');
            setOpenDialog(false);
            navigate('/');
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(productId);
                setSuccess('Product deleted successfully');
                navigate('/');
            } catch (err) {
                console.error('Error deleting product:', err);
                setError('Failed to delete product');
            }
        }
    };

    const menuItems = [
        { text: 'Products', icon: '🛍️', path: '/' },
        { text: 'Profile', icon: '👤', path: '/profile' },
        ...(user?.isAdmin ? [
            { text: 'Admin Dashboard', icon: '📊', path: '/admin' },
            { text: 'Add Product', icon: '➕', action: () => { setSelectedProduct(null); setOpenDialog(true); } },
            { text: 'Edit Products', icon: '✏️', path: '/products/edit' },
            { text: 'Delete Products', icon: '🗑️', path: '/products/delete' }
        ] : [])
    ];

    return (
        <div className={styles.layout}>
            <header className={styles.appBar}>
                <button className={styles.menuButton} onClick={handleDrawerToggle}>
                    ☰
                </button>
                {user && (
                    <span className={styles.welcomeMessage}>Welcome, {user.first_name}</span>
                )}
                <div className={styles.toolbar}>
                    {user && (
                        <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleLogout}>
                            Logout
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
                            placeholder="Search products..."
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
                onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
                initialData={selectedProduct}
            />
        </div>
    );
};

export default Layout; 