const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); 


router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: 'Error creating booking', error });
    }
});


router.get('/my-bookings/:userId', async (req, res) => {
    try {
        const myBookings = await Booking.find({ user: req.params.userId }).populate('vehicle');
        res.status(200).json(myBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching personal trips', error });
    }
});


router.get('/', async (req, res) => {
    try {
       
        const allBookings = await Booking.find().populate('user').populate('vehicle');
        res.status(200).json(allBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platform bookings', error });
    }
});


router.put('/:id', async (req, res) => {
    try {
     
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

router.delete('/:id', async (req, res) => { 
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking successfully cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
});

module.exports = router;