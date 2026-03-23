const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        const newUser = new User({
            username,
            password,
            role: 'Standard' 
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', username: newUser.username, role: newUser.role });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;