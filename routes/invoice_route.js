const express = require("express");
const { create } = require("../models/invoice");
const InvoiceModel = require("../models/invoice");
const router = express.Router();
const { createInvoice } = require("../services/pdf-service");

router.post("/", async (req, res) => {
    const { creator, items, client, status, invoice_number, due_date } =
        req.body;
    if (
        !creator ||
        !items ||
        !client ||
        !status ||
        !invoice_number ||
        !due_date
    ) {
        return res.status(400).send({ message: "All fields are required." });
    } else if (creator === client) {
        return res.status(400).send({ message: "Invalid invoice." });
    }

    const newInvoice = new InvoiceModel({
        creator,
        items,
        client,
        status,
        invoice_number,
        due_date,
    });

    try {
        const savedInvoice = await newInvoice.save();
        return res
            .status(201)
            .send({ message: "Invoice created with id: " + savedInvoice.id });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/", async (req, res) => {
    // console.log(req.userInfo);
    const { id } = req.userInfo;
    try {
        const list = await InvoiceModel.find({ creator: id })
            .populate("creator", "name email address")
            .populate("client", "name email address")
            .populate("items.item", "name cost description");
        return res.status(200).json(list);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/:status", async (req, res) => {
    // console.log(req.userInfo);
    const { id } = req.userInfo;
    const { status } = req.params;
    try {
        const list = await InvoiceModel.find({ creator: id, status: status })
            .populate("creator", "name email address")
            .populate("client", "name email address")
            .populate("items.item", "name cost description");
        return res.status(200).json(list);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const user_id = req.userInfo.id;
    const { status } = req.body;
    try {
        const existingInvoice = await InvoiceModel.findByIdAndUpdate(id, {
            status: status,
        });
        return res
            .status(200)
            .send({ message: "Invoice successfully updated." });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.delete("/", async (req, res) => {
    const { id } = req.body;
    try {
        await InvoiceModel.findByIdAndDelete(id);
        return res
            .status(200)
            .send({ message: "Invoice successfully removed." });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/pdf/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await InvoiceModel.findById(id)
            .populate("creator", "name email address")
            .populate("client", "name email address")
            .populate("items.item", "name cost description");
        // console.log(invoice)
        const stream = res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment;filename=invoice.pdf"
        })
        createInvoice(invoice, 
            (chunk) => stream.write(chunk), 
            () => stream.end()
        );
    } catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;
