import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './uploads/cvs/',
    filename: function(req, file, cb){
        cb(null, `cv-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 5000000}, // 5MB limit
    fileFilter: function(req, file, cb){
        // Allow PDFs and Word documents
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if(mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: Only PDF and Word documents are allowed!');
        }
    }
});

export default upload;