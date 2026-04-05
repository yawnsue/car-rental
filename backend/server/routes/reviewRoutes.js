const express = require('express');
const router = express.Router();
const Review = require('../../../database/models/reviews');

router.post('/', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: 'Error creating review', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('user').populate('vehicle');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});

router.get('/vehicle/:vehicleId', async (req, res) => {
    try {
        const reviews = await Review.find({ vehicle: req.params.vehicleId })
            .populate('user')
            .populate('vehicle');

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicle reviews', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user')
            .populate('vehicle');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: 'Error updating review', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
});

module.exports = router;
