const express = require("express");
const ItemModel = require("../models/item");
const router = express.Router();

router.post("/", async (req, res) => {
    const { owner, name, cost, description } = req.body;
    if (!owner || !name || !cost) {
        return res.status(400).send({ message: "Item name and cost are required." });
    }

    const newItem = new ItemModel({
        owner, 
        name, 
        cost, 
        description,
    });

    try {
        const savedItem = await newItem.save();
        return res.status(201).send({ message: "Item created with id: " + savedItem.id });
    } catch(err) {
        return res.status(500).send(err);
    }
});

router.get("/", async (req, res) => {
    // console.log(req.userInfo);
    const { id } = req.userInfo;
    try {
        const list = await ItemModel.find({ owner: id }).populate("owner", "name email");
        return res.status(200).json(list);
    } catch(err) {
        return res.status(500).send(err);
    }
});

router.delete("/", async (req, res) => {
    const { id } = req.body;
    try {
        await ItemModel.findByIdAndDelete(id);
        return res.status(200).send({ message: "Item successfully deleted." });
    } catch(err) {
        return res.status(500).send(err);
    }
});

module.exports = router;