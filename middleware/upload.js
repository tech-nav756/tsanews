// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Define storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');  // Directory where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique file name
    }
});

// File filter (accept only images)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);  // Allow file
    }
    cb('Error: Images only!');
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Max file size: 5MB
    fileFilter: fileFilter
});

module.exports = upload;
