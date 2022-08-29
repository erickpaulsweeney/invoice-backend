const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InvoiceUsers",
            require: true,
        },
        items: [
            mongoose.Schema({
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "InvoiceItems",
                    require: true,
                },
                quantity: {
                    type: Number,
                    require: true,
                },
            }),
        ],
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InvoiceClients",
            require: true,
        },
        status: {
            type: String,
            require: true,
        },
        invoice_number: {
            type: Number,
            require: true,
            unique: true,
        },
        due_date: {
            type: Date,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

const InvoiceModel = mongoose.model("Invoices", invoiceSchema);
module.exports = InvoiceModel;
