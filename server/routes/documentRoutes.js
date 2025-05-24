const express = require('express');
const router = express.Router();
const Document = require("../models/Document");
const mongoose = require('mongoose');

router.get("/:id", async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id); // <-- fix here
        if (!doc) return res.status(404).json({ message: "Document Not Found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        const doc = new Document({ title, content });
        await doc.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const doc = await Document.findByIdAndUpdate(  // <-- fix here
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: "Document Not Found" });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;  // <-- export router
