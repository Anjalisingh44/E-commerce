// product.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, Date.now() + path.extname(file.originalname));
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Configure upload with `.single` or `.array`
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload; // Make sure to export `upload` properly
