const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const connectDb = require("./config/dbconnection");
const path = require('path');

connectDb();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

app.use("/api/users", require("./routes/user"));
app.use("/api/products", require("./routes/product"));
app.use("/api/category", require("./routes/category"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/order", require("./routes/order"));
app.use("/api/payment", require("./routes/payment"))





app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

