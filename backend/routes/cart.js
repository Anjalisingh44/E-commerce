const express = require("express");
const { addToCart, removeFromCart, getCart } = require("../controller/cart");
const validateToken = require("../middleware/validateToken");

const router = express.Router();


router.post("/add/:productId", validateToken, addToCart);


router.delete("/remove/:productId", validateToken, removeFromCart);


router.get("/get_cart", validateToken, getCart);



module.exports = router;
