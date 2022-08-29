const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        clients: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "InvoiceClients",
             },
        ],
        invoices: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Invoices"
             },
        ],
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("InvoiceUsers", userSchema);
module.exports = UserModel;
