const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InvoiceUsers",
            require: true,
        },
        name: {
            type: String,
            require: true,
            unique: true,
        },
        cost: {
            type: Number,
            require: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const ItemModel = mongoose.model("InvoiceItems", itemSchema);
module.exports = ItemModel;
