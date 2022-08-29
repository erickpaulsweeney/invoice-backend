const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
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
        address: {
            type: String,
            require: true,
        },
        client_of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InvoiceUsers", 
            require: true
        }
    },
    {
        timestamps: true,
    }
);

const ClientModel = mongoose.model("InvoiceClients", clientSchema);
module.exports = ClientModel;
