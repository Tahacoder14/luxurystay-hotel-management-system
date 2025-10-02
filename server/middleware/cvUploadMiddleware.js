import multer from 'multer';

const storage = multer.memoryStorage(); // Use in-memory storage

const upload = multer({
    storage: storage,
    limits:{fileSize: 5000000}, // 5MB limit
    // ... fileFilter logic ...
});

export default upload;