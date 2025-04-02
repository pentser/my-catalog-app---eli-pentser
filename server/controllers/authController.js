const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

const register = async (req, res) => {
    try {
        const { user_name, first_name, last_name, email, birth_date, password } = req.body;

        // Validate required fields
        if (!user_name || !first_name || !last_name || !email || !birth_date || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { user_name }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Create new user
        const user = new User({
            user_id: Date.now(), // Simple way to generate unique ID
            user_name,
            first_name,
            last_name,
            email,
            birth_date: new Date(birth_date),
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            error: error.message || 'Registration failed' 
        });
    }
};

const login = async (req, res) => {
    try {
        const { user_name, password } = req.body;

        // Debug log
        console.log('Login attempt:', { user_name, password });

        // Validate required fields
        if (!user_name || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ user_name });
        
        // Debug log
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        
        // Debug log
        console.log('Password match:', isMatch ? 'Yes' : 'No');
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            error: error.message || 'Login failed' 
        });
    }
};

module.exports = {
    register,
    login
}; 