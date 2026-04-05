const express = require('express');
const router = express.Router();
const Booking = require('../../../database/models/Booking');

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

router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user').populate('vehicle');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: 'Error updating booking details', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking successfully cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
});

module.exports = router;
