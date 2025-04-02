const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
    {
        product_id: 1001,
        product_name: "מחשב נייד HP",
        product_description: "מחשב נייד HP עם מעבד Intel i7, 16GB RAM, 512GB SSD",
        current_stock_level: 15,
        status: true
    },
    {
        product_id: 1002,
        product_name: "טלפון חכם Samsung",
        product_description: "טלפון חכם Samsung Galaxy S21 עם מסך 6.2 אינץ', 128GB אחסון",
        current_stock_level: 20,
        status: true
    },
    {
        product_id: 1003,
        product_name: "מצלמה דיגיטלית Canon",
        product_description: "מצלמה דיגיטלית Canon EOS R6 עם חיישן 20.1MP",
        current_stock_level: 8,
        status: true
    },
    {
        product_id: 1004,
        product_name: "אוזניות Bluetooth Sony",
        product_description: "אוזניות אלחוטיות Sony WH-1000XM4 עם ביטול רעשים",
        current_stock_level: 25,
        status: true
    },
    {
        product_id: 1005,
        product_name: "טאבלט iPad",
        product_description: "טאבלט Apple iPad Pro 12.9 עם מסך Liquid Retina XDR",
        current_stock_level: 12,
        status: true
    }
];

const seedProducts = async () => {
    try {
        // מחיקת כל המוצרים הקיימים
        await Product.deleteMany({});
        
        // הוספת המוצרים החדשים
        await Product.insertMany(products);
        
        console.log('Products seeded successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
};

module.exports = seedProducts; 