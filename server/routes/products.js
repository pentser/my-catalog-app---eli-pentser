const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController');

// Public routes (require authentication)
router.get('/', auth, getProducts);
router.get('/search', auth, searchProducts);
router.get('/:id', auth, getProduct);

// Admin only routes
router.post('/', auth, isAdmin, createProduct);
router.put('/:id', auth, isAdmin, (req, res, next) => {
    console.log('PUT request received for product:', req.params.id);
    next();
}, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router; 