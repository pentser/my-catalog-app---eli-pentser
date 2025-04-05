const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1606161290889-77950cfb67d3?w=800&auto=format&fit=crop' // תמונת ברירת מחדל של קופסה/מוצר כללי
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    current_stock_level: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 