const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validation/auth');

const generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

const register = async (req, res) => {
    try {
        console.log('Registration attempt with data:', req.body);

        // Validate request body
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            console.log('Validation error:', error.details);
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: errors.join(', ')
            });
        }

        const { user_name, first_name, last_name, email, birth_date, password } = value;

        console.log('Checking for existing user...');
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { user_name }] 
        });

        if (existingUser) {
            console.log('User already exists:', { email, user_name });
            return res.status(400).json({ 
                error: 'משתמש עם אימייל או שם משתמש זה כבר קיים במערכת' 
            });
        }

        console.log('Creating new user...');
        // Create new user
        const user = new User({
            user_id: Date.now(),
            user_name,
            first_name,
            last_name,
            email,
            birth_date: new Date(birth_date),
            password,
            isAdmin: false // Always set to false for new registrations
        });

        console.log('Saving user to database...');
        await user.save();
        console.log('User saved successfully:', user._id);

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
        console.error('Error stack:', error.stack);
        console.error('MongoDB connection string:', process.env.MONGODB_URI ? 'Set' : 'Not set');
        res.status(500).json({ 
            error: error.message || 'ההרשמה נכשלה',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const login = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: errors.join(', ')
            });
        }

        const { user_name, password } = value;

        // Debug log
        console.log('Login attempt:', { user_name });

        // Find user
        const user = await User.findOne({ user_name });
        
        // Debug log
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        
        // Debug log
        console.log('Password match:', isMatch ? 'Yes' : 'No');
        
        if (!isMatch) {
            return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
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
            error: error.message || 'ההתחברות נכשלה' 
        });
    }
};

module.exports = {
    register,
    login
}; 