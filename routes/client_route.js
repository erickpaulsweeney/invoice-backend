const express = require("express");
const ClientModel = require("../models/client");
const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, address, client_of } = req.body;
    if (!name || !email || !address || !client_of) {
        return res.status(400).send({ message: "All fields are required." });
    }

    const newClient = new ClientModel({
        name, 
        email, 
        address,
        client_of,
    });

    try {
        const savedClient = await newClient.save();
        return res.status(201).send({ message: "Client created with id: " + savedClient.id });
    } catch(err) {
        return res.status(500).send(err);
    }
});

router.get("/", async (req, res) => {
    // console.log(req.userInfo);
    const { id } = req.userInfo;
    try {
        const list = await ClientModel.find({ client_of: id }).populate("client_of", "name email");
        return res.status(200).json(list);
    } catch(err) {
        return res.status(500).send(err);
    }
});

router.delete("/", async (req, res) => {
    const { id } = req.body;
    try {
        await ClientModel.findByIdAndDelete(id);
        return res.status(200).send({ message: "Client successfully removed." });
    } catch(err) {
        return res.status(500).send(err);
    }
});

module.exports = router;