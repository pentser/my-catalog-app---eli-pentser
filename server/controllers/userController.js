const User = require('../models/User');
const bcrypt = require('bcrypt');
const { registerValidation, updateProfileValidation } = require('../validation/userValidation');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.user.user_id })
            .select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        console.log('Update profile attempt with data:', req.body);
        console.log('User ID:', req.user._id);

        const { error } = updateProfileValidation(req.body);
        if (error) {
            console.log('Validation error:', error.details);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { first_name, last_name, email, birth_date, preferences } = req.body;
        const userId = req.user._id;

        // בדיקת תקינות התאריך
        let parsedDate;
        try {
            parsedDate = new Date(birth_date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('תאריך לא תקין');
            }
        } catch (dateError) {
            console.error('Invalid date:', birth_date, dateError);
            return res.status(400).json({ message: 'תאריך הלידה אינו תקין' });
        }

        console.log('Checking for existing email...');
        const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingEmail) {
            console.log('Email already exists:', email);
            return res.status(400).json({ message: 'כתובת האימייל כבר קיימת במערכת' });
        }

        // בדיקת תקינות העדפות
        const pageSize = preferences?.page_size || 12;
        if (typeof pageSize !== 'number' || pageSize < 1 || pageSize > 100) {
            return res.status(400).json({ message: 'גודל העמוד חייב להיות מספר בין 1 ל-100' });
        }

        const updateData = {
            first_name,
            last_name,
            email,
            birth_date: parsedDate,
            preferences: {
                page_size: pageSize
            }
        };

        console.log('Updating user profile with data:', updateData);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ message: 'המשתמש לא נמצא' });
        }

        console.log('User updated successfully:', updatedUser._id);
        res.json(updatedUser);
    } catch (err) {
        console.error('שגיאה בעדכון פרופיל:', err);
        console.error('Error stack:', err.stack);
        console.error('Error details:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
        
        // שליחת הודעת שגיאה מפורטת יותר
        let errorMessage = 'שגיאה בעדכון הפרופיל';
        if (err.name === 'ValidationError') {
            errorMessage = 'שגיאה באימות הנתונים';
        } else if (err.name === 'CastError') {
            errorMessage = 'שגיאה בהמרת נתונים';
        }
        
        res.status(500).json({ 
            message: errorMessage,
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ user_id: 1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user status (admin only)
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findOne({ user_id: req.params.id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.status = status;
        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user (admin only)
const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['first_name', 'last_name', 'email', 'birth_date', 'isAdmin'];
        
        // Filter out any updates that aren't allowed
        Object.keys(updates).forEach(update => {
            if (!allowedUpdates.includes(update)) {
                delete updates[update];
            }
        });

        const user = await User.findOne({ user_id: req.params.id });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields
        Object.keys(updates).forEach(update => {
            user[update] = updates[update];
        });

        await user.save();

        // Return updated user without password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { user_name, first_name, last_name, email, password, birth_date } = req.body;

        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return res.status(400).json({ message: 'שם המשתמש כבר קיים במערכת' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'כתובת האימייל כבר קיימת במערכת' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            user_name,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            birth_date: new Date(birth_date),
            preferences: {
                page_size: 12
            }
        });

        await user.save();
        res.status(201).json({ message: 'המשתמש נרשם בהצלחה' });
    } catch (err) {
        console.error('שגיאה ברישום משתמש:', err);
        res.status(500).json({ message: 'שגיאה ברישום המשתמש' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserStatus,
    updateUser
}; 