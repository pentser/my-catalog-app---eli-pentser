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
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 