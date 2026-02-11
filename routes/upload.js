const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create subdirectories based on file type
        let subDir = 'misc';
        if (file.mimetype.startsWith('image/')) {
            subDir = 'images';
        } else if (file.mimetype.startsWith('video/')) {
            subDir = 'videos';
        }

        const fullPath = path.join(uploadsDir, subDir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename while preserving extension
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};

// Configure multer with file size limits
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    }
});

// Single file upload endpoint
router.post('/single', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Determine subdirectory based on file type
        let subDir = 'misc';
        if (req.file.mimetype.startsWith('image/')) {
            subDir = 'images';
        } else if (req.file.mimetype.startsWith('video/')) {
            subDir = 'videos';
        }

        const fileUrl = `/uploads/${subDir}/${req.file.filename}`;

        res.status(201).json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: fileUrl
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Multiple files upload endpoint
router.post('/multiple', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => {
            let subDir = 'misc';
            if (file.mimetype.startsWith('image/')) {
                subDir = 'images';
            } else if (file.mimetype.startsWith('video/')) {
                subDir = 'videos';
            }

            return {
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `/uploads/${subDir}/${file.filename}`
            };
        });

        res.status(201).json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete file endpoint
router.delete('/:type/:filename', (req, res) => {
    try {
        const { type, filename } = req.params;
        const filePath = path.join(uploadsDir, type, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 50MB.' });
        }
        return res.status(400).json({ message: error.message });
    }
    if (error.message) {
        return res.status(400).json({ message: error.message });
    }
    next(error);
});

module.exports = router;
