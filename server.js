require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

mongoose
    .connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

const authRouter = require("./routes/auth_route");
const itemRouter = require("./routes/item_route");
const clientRouter = require("./routes/client_route");
const invoiceRouter = require("./routes/invoice_route");

const app = express(); 

// Middlewares
app.use(cors());
app.use(express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(morgan("dev"));

// Routes
app.use("/auth", authRouter);
app.use(authenticateRequest);
app.use("/item", itemRouter);
app.use("/client", clientRouter);
app.use("/invoice", invoiceRouter);

app.listen(process.env.PORT || 8000);

function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers["authorization"];
    if (authHeaderInfo === undefined) {
        return res.status(401).send({ message: "No token provided" });
    }

    const token = authHeaderInfo.split(" ")[1];
    if (token === undefined) {
        return res.status(401).send({ message: "Proper token not provided" });
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userInfo = payload;
        next();
    } catch (error) {
        return res.status(403).send({ message: error.message });
    }
}
