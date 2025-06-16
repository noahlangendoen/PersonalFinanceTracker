const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1});
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


router.post('/', [
    auth, 
    check('type', 'Type is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601().toDate(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, category, description, date } = req.body;
    
    try {
        const newTransaction = new Transaction({
            user: req.user.id,
            type,
            amount,
            category,
            description,
            date,
        });

        const saved = await newTransaction.save();
        res.json(saved);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', [
    auth, 
    check('type', 'Type is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { type, amount, category, description, date } = req.body;

    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { type, amount, category, description, date },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Ensure the transaction belongs to the authenticated user
        if (updatedTransaction.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await updatedTransaction.save();
        res.json(updatedTransaction);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Ensure the transaction belongs to the authenticated user
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await transaction.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;