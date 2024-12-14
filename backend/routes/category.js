const express = require("express");
const {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById
} = require("../controller/category");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

// Route for adding a new category
router.post("/add-category", validateToken, addCategory);

// Route for updating an existing category
router.put("/update-category/:id", validateToken, updateCategory);

// Route for deleting a category
router.delete("/delete-category/:id", validateToken, deleteCategory);

// Route for getting all categories
router.get("/get-all-categories", getAllCategories);

// Route for getting a category by ID
router.get("/get-category-by-id/:id", getCategoryById);

module.exports = router;
