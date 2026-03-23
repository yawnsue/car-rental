const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle'); 

router.post('/', async (req, res) => { //Create for adimn
    try {
        const newVehicle = new Vehicle(req.body);
        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get('/', async (req, res) => { //Read for all users
    try {
        const vehicles = await Vehicle.find(); 
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.put('/:id', async (req, res) => { //Updates for admin
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.delete('/:id', async (req, res) => { //Delete for admin added
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Vehicle removed' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;