const Product = require('../models/Product');

// Get all products with pagination
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || req.user.preferences.page_size;
        const skip = (page - 1) * limit;

        const products = await Product.find({ status: true })
            .skip(skip)
            .limit(limit)
            .sort({ creation_date: -1 });

        const total = await Product.countDocuments({ status: true });

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ 
            product_id: req.params.id,
            status: true 
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new product (admin only)
const createProduct = async (req, res) => {
    try {
        const { product_name, product_description, current_stock_level } = req.body;

        const product = new Product({
            product_id: Date.now(),
            product_name,
            product_description,
            current_stock_level
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
    try {
        console.log('Updating product with ID:', req.params.id);
        console.log('Update data:', req.body);
        
        const product = await Product.findOne({ product_id: req.params.id });

        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ error: 'Product not found' });
        }

        const { product_name, product_description, current_stock_level } = req.body;
        
        // עדכון רק של השדות המותרים
        if (product_name) product.product_name = product_name;
        if (product_description) product.product_description = product_description;
        if (current_stock_level !== undefined) product.current_stock_level = current_stock_level;

        await product.save();
        console.log('Product updated successfully');
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ product_id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Soft delete - just update status
        product.status = false;
        await product.save();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const query = req.query.query || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || req.user.preferences.page_size || 10;
        const skip = (page - 1) * limit;

        const searchQuery = {
            status: true,
            $or: [
                { product_name: { $regex: query, $options: 'i' } },
                { product_description: { $regex: query, $options: 'i' } }
            ]
        };

        const products = await Product.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ creation_date: -1 });

        const total = await Product.countDocuments(searchQuery);

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
}; 