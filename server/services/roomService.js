const Room = require('../models/Room');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class RoomService {
    async getAll() {
        // Return rooms sorted by the most recently created
        return await Room.find({}).sort({ createdAt: -1 });
    }

    async getById(roomId) {
        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error('Room not found with that ID');
        }
        return room;
    }

    // --- THIS IS THE CORE IMAGE COMPRESSION LOGIC ---
    async create(roomData, file) {
        if (!file) {
            throw new Error('An image file is required to create a room.');
        }

        const { name, type, price, description, status } = roomData;
        
        // Step 1: Read the uploaded (original) image file and compress it using 'sharp'
        const compressedImageBuffer = await sharp(file.path)
            .resize(1024, 768, { fit: 'cover' }) // Resize to a consistent dimension
            .jpeg({ quality: 85, mozjpeg: true }) // Compress to a high-quality JPEG
            .toBuffer();

        // Step 2: Define a new, unique filename for the compressed image
        const newFilename = `compressed-${file.filename}`;
        const newPath = path.join('uploads', newFilename);

        // Step 3: Save the new, compressed image buffer to the 'uploads' folder
        fs.writeFileSync(newPath, compressedImageBuffer);
        
        // Step 4: Clean up by deleting the original, uncompressed temporary file
        fs.unlinkSync(file.path);

        // Step 5: Create the new room document, saving ONLY the path to the compressed image
        const newRoom = new Room({
            name, type, price, description, status,
            imageUrl: `/${newPath.replace(/\\/g, '/')}` // Ensure forward slashes for URL compatibility
        });

        // Step 6: Save the new room details (with the image link) to MongoDB
        return await newRoom.save();
    }

    async update(roomId, updateData) {
        const allowedUpdates = ['name', 'price', 'description', 'status'];
        const updates = {};
        for (const key in updateData) {
            if (allowedUpdates.includes(key)) {
                updates[key] = updateData[key];
            }
        }

        const updatedRoom = await Room.findByIdAndUpdate(roomId, updates, { new: true, runValidators: true });
        if (!updatedRoom) {
            throw new Error('Room not found');
        }
        return updatedRoom;
    }

    async delete(roomId) {
        const room = await Room.findByIdAndDelete(roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        // Also delete the associated image file from the server's storage
        if (room.imageUrl) {
            const imagePath = path.join(__dirname, '..', room.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        return room;
    }
}

module.exports = new RoomService();