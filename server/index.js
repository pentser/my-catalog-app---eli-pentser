require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const seedProducts = require('./seed/products');
const seedUsers = require('./seed/users');
const fs = require('fs');

const app = express();

// Health Check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://catalog-app-b6cx9.ondigitalocean.app']
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    const publicPath = path.join(__dirname, 'public');
    
    // Check if public directory exists
    if (!fs.existsSync(publicPath)) {
        console.warn('Public directory does not exist at:', publicPath);
        console.warn('Creating public directory...');
        fs.mkdirSync(publicPath, { recursive: true });
    }

    console.log('Serving static files from:', publicPath);
    console.log('Directory contents:', fs.readdirSync(publicPath));
    
    // Serve static files
    app.use(express.static(publicPath));
}

// MongoDB Connection Options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    dbName: 'productsDB'
};

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI is set:', !!process.env.MONGODB_URI);
console.log('Environment:', process.env.NODE_ENV);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productsDB', mongooseOptions)
    .then(async () => {
        console.log('Connected to MongoDB successfully');
        console.log('Database name:', mongoose.connection.db.databaseName);
        
        // Seed data only in development
        if (process.env.NODE_ENV !== 'production') {
            await seedUsers();
            await seedProducts();
            console.log('Data seeding completed');
        }
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        // Don't exit the process, just log the error
        console.error('Failed to connect to MongoDB, will retry...');
    });

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
    });
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));

// Serve React app for any other routes in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/')) {
            return next();
        }
        
        const indexPath = path.join(__dirname, 'public', 'index.html');
        
        // Check if index.html exists
        if (!fs.existsSync(indexPath)) {
            console.warn('index.html not found at:', indexPath);
            return res.status(404).json({ 
                error: 'Application files not found',
                path: indexPath,
                publicDir: fs.readdirSync(path.join(__dirname, 'public'))
            });
        }
        
        console.log('Serving index.html for path:', req.path);
        res.sendFile(indexPath);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    console.error('Stack trace:', err.stack);
    console.error('Request path:', req.path);
    console.error('Request method:', req.method);
    console.error('Request headers:', req.headers);
    
    res.status(500).json({ 
        error: 'Something went wrong!',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
}); 