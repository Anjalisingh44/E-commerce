const express = require("express");
const validateToken = require("../middleware/validateToken");

const { addToWishlist, removeFromWishlist, getWishlist } = require("../controller/wishlist");

const router = express.Router();

// Route to add a product to the user's wishlist
router.post("/add",validateToken, addToWishlist);

// Route to remove a product from the user's wishlist
router.delete("/remove/:productId",validateToken,removeFromWishlist);

// Route to get all products in the user's wishlist
router.get("/get",validateToken, getWishlist);

module.exports = router;
