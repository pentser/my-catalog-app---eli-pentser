import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api';
import styles from './Products.module.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const { user } = useAuth();
    const isAdmin = user?.isAdmin;

    return (
        <div className={styles.productCard}>
            <div className={styles.productContent}>
                <h3 className={styles.productTitle}>{product.product_name}</h3>
                <p className={styles.productId}>ID: {product.product_id}</p>
                <p className={styles.productDescription}>{product.product_description}</p>
                <p className={styles.productStock}>Stock: {product.current_stock_level}</p>
            </div>
            {isAdmin && (
                <div className={styles.productActions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => onEdit(product)}>
                        ✏️ Edit
                    </button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => onDelete(product.product_id)}>
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

const ProductForm = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        product_description: '',
        current_stock_level: 0
    });

    useEffect(() => {
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
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        {initialData ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const { user } = useAuth();
    const isAdmin = user?.isAdmin;
    const location = useLocation();

    const fetchProducts = async () => {
        try {
            let response;
            if (searchQuery.trim()) {
                response = await productsAPI.search(searchQuery.trim(), page);
            } else {
                response = await productsAPI.getAll(page);
            }
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, searchQuery, location.state?.search]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ search: searchQuery.trim() });
            setPage(1);
        } else {
            setSearchParams({});
            setPage(1);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim()) {
            setSearchParams({ search: value.trim() });
            setPage(1);
        } else {
            setSearchParams({});
            setPage(1);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleCreateProduct = async (formData) => {
        try {
            const productData = {
                ...formData,
                product_id: Date.now()
            };
            await productsAPI.create(productData);
            setSuccess('Product created/deleted/updated successfully');
            setOpenDialog(false);
            fetchProducts();
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
            fetchProducts();
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
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
                setError('Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Products</h1>
                <div className={styles.searchContainer}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className={styles.searchButton}>
                            🔍 Search
                        </button>
                    </form>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.productsGrid}>
                {products.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDeleteProduct}
                    />
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    className={`${styles.paginationButton} ${page === 1 ? styles.disabled : ''}`}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>
                    Page {page} of {totalPages}
                </span>
                <button
                    className={`${styles.paginationButton} ${page === totalPages ? styles.disabled : ''}`}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            {isAdmin && (
                <button
                    className={styles.addButton}
                    onClick={() => {
                        setSelectedProduct(null);
                        setOpenDialog(true);
                    }}
                >
                    + Add Product
                </button>
            )}

            <ProductForm
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
                initialData={selectedProduct}
            />
        </div>
    );
};

export default Products; 