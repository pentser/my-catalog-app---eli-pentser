const User = require('../models/User');

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
        const updates = req.body;
        const allowedUpdates = ['first_name', 'last_name', 'email', 'birth_date', 'preferences'];
        
        // Filter out any updates that aren't allowed
        Object.keys(updates).forEach(update => {
            if (!allowedUpdates.includes(update)) {
                delete updates[update];
            }
        });

        const user = await User.findOne({ user_id: req.user.user_id });
        
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

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserStatus,
    updateUser
}; 