import multer from 'multer';

const storage = multer.memoryStorage();
const cvUpload = multer({ storage });

export default cvUpload;