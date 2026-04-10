const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Material = require('../models/Material');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // saving files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Allow PDF and images only for our materials
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only PDFs and Images are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/materials/upload - Upload a file (note/image)
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { title, type, teacherName, teacherId } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const material = new Material({
            type, // 'note' or 'image'
            title,
            fileUrl: `/uploads/${req.file.filename}`,
            fileName: req.file.originalname,
            teacherName,
            teacherId
        });

        await material.save();

        res.json({ success: true, message: 'Material uploaded successfully', material });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error during upload' });
    }
});

// POST /api/materials/announcement - Create an announcement
router.post('/announcement', async (req, res) => {
    try {
        const { title, content, teacherName, teacherId } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const announcement = new Material({
            type: 'announcement',
            title,
            content,
            teacherName,
            teacherId
        });

        await announcement.save();

        res.json({ success: true, message: 'Announcement created successfully', material: announcement });
    } catch (error) {
        console.error('Announcement creation error:', error);
        res.status(500).json({ success: false, message: 'Server error during announcement creation' });
    }
});

// GET /api/materials - Get all materials (filtered optionally)
router.get('/', async (req, res) => {
    try {
        const typeFilter = req.query.type; // can be 'announcement', 'note', 'image'
        let query = {};
        if (typeFilter) {
            query.type = typeFilter;
        }

        const materials = await Material.find(query).sort({ createdAt: -1 }); // newest first
        res.json({ success: true, count: materials.length, materials });
    } catch (error) {
        console.error('Get materials error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching materials' });
    }
});

module.exports = router;
