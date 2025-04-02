import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api';
import styles from './Products.module.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
    return (
        <div className={styles.productCard}>
            <div className={styles.productContent}>
                <h3 className={styles.productTitle}>{product.product_name}</h3>
                <p className={styles.productId}>ID: {product.product_id}</p>
                <p className={styles.productDescription}>{product.product_description}</p>
                <p className={styles.productStock}>Stock: {product.current_stock_level}</p>
            </div>
            <div className={styles.productActions}>
                <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => onEdit(product)}>
                    ✏️ Edit
                </button>
                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => onDelete(product.product_id)}>
                    🗑️ Delete
                </button>
            </div>
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
            <h2 className={styles.dialogTitle}>Edit Product</h2>
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
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

const EditProducts = () => {
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data.products);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleUpdateProduct = async (formData) => {
        try {
            console.log('handleUpdateProduct called with formData:', formData);
            console.log('selectedProduct:', selectedProduct);
            
            if (!selectedProduct || !selectedProduct.product_id) {
                console.error('No product selected or missing product_id');
                setError('No product selected for update');
                return;
            }
            
            const updateData = {
                product_name: formData.product_name,
                product_description: formData.product_description,
                current_stock_level: formData.current_stock_level
            };
            
            console.log('Calling productsAPI.update with:', {
                id: selectedProduct.product_id,
                data: updateData
            });
            
            await productsAPI.update(selectedProduct.product_id, updateData);
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

    if (!user?.isAdmin) {
        return <div className={styles.error}>Access denied. Admin privileges required.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Edit Products</h1>
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

            <ProductForm
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleUpdateProduct}
                initialData={selectedProduct}
            />
        </div>
    );
};

export default EditProducts; 