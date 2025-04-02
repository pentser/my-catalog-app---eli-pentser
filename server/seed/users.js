const User = require('../models/User');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
    try {
        // Delete existing users
        await User.deleteMany({});

        // Create test user
        const testUser = new User({
            user_id: 1001,
            user_name: 'eli',
            first_name: 'Eli',
            last_name: 'Test',
            email: 'eli@test.com',
            birth_date: new Date('1990-01-01'),
            password: '123456',
            isAdmin: true,
            status: true
        });

        await testUser.save();
        console.log('Test user created successfully');

    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

module.exports = seedUsers; 