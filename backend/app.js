const express = require("express");
const app = express();

app.use(express.json());

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const errorMiddleWare = require("./middleware/error");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use(errorMiddleWare);

module.exports = app;
