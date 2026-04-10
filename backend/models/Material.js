const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['note', 'image', 'announcement']
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String, // Used for announcements
        trim: true
    },
    fileUrl: {
        type: String // Used for notes and images
    },
    fileName: {
        type: String // Original file name
    },
    teacherName: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Material', materialSchema);
