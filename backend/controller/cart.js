const Cart = require("../models/cart");
const Product= require("../models/product");

const asyncHandler = require("express-async-handler");

// Add or update a product in the cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
   

    if(!userId) {
        res.status(400).json({ message: "UserID is required" });
    }
    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }
    const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
});

// Remove a product from the cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;  // Get the product ID from the URL parameters
  const userId = req.user.id;  // Get the user ID from the authenticated token

  // Find the cart of the authenticated user
  const cart = await Cart.findOne({ userId });

  // If no cart is found, send a 404 error
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Filter out the item with the given productId from the cart's items
  const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);

  // If the item doesn't exist in the cart
  if (updatedItems.length === cart.items.length) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  // Update the cart with the new filtered items
  cart.items = updatedItems;

  // Save the updated cart
  await cart.save();

  // Send a success response with the updated cart
  res.status(200).json({ message: "Product removed from cart", cart });
});


// Get the user's cart
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
});




module.exports = { addToCart, removeFromCart, getCart };
