const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); 

// 1. CREATE: Standard User creates a new reservation
router.post('/', async (req, res) => {
    try {
        // In your final version, the user ID should come from a secure auth token.
        // For testing, we are passing it in the request body.
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: 'Error creating booking', error });
    }
});

// 2. READ (Standard User): Fetch ONLY the logged-in user's bookings
router.get('/my-bookings/:userId', async (req, res) => {
    try {
        // This query strictly searches for bookings matching the specific user's ID
        // The .populate() method automatically pulls in the vehicle details for the React frontend
        const myBookings = await Booking.find({ user: req.params.userId }).populate('vehicle');
        res.status(200).json(myBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching personal trips', error });
    }
});

// 3. READ (Administrator): Fetch ALL bookings on the platform
router.get('/', async (req, res) => {
    try {
        // This query grabs everything in the collection for the Admin Dashboard
        const allBookings = await Booking.find().populate('user').populate('vehicle');
        res.status(200).json(allBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platform bookings', error });
    }
});

// 4. UPDATE: Modify an existing booking (e.g., extending the rental dates)
router.put('/:id', async (req, res) => {
    try {
        // Note: Your team will need to add logic here ensuring a standard user 
        // is only updating their own booking ID.
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: 'Error updating booking details', error });
    }
});

router.delete('/:id', async (req, res) => { // added so theres a way to delete/cancel a booking
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking successfully cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
});

module.exports = router;