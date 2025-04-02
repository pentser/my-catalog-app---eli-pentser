const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserStatus,
    updateUser
} = require('../controllers/userController');

// User routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// Admin only routes
router.get('/', auth, isAdmin, getAllUsers);
router.put('/:id/status', auth, isAdmin, updateUserStatus);
router.put('/:id', auth, isAdmin, updateUser);

module.exports = router; 