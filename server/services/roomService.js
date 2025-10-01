import Room from '../models/Room.js';
import sharp from 'sharp';

/**
 * A professional service class to handle all room-related business logic,
 * architected for in-memory image buffers (multer.memoryStorage).
 */
class RoomService {
    async getAll() {
        return await Room.find({}).sort({ createdAt: -1 });
    }

    async getById(roomId) {
        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error('Room not found with that ID');
        }
        return room;
    }

    async create(roomData, file) {
        if (!file) {
            throw new Error('An image file is required to create a room.');
        }

        // --- THE DEFINITIVE `memoryStorage` IMAGE PROCESSING WORKFLOW ---
        // Step 1: Take the raw image buffer from memory (file.buffer).
        // Step 2: Use 'sharp' to compress and standardize the image.
        const compressedImageBuffer = await sharp(file.buffer)
            .resize(1200, 800, { fit: 'cover' })
            .jpeg({ quality: 85 })
            .toBuffer();

        // Step 3: Convert the compressed buffer into a Data URI string.
        const imageURI = `data:${file.mimetype};base64,${compressedImageBuffer.toString('base64')}`;

        // Step 4: Create and save the new room document with the Data URI.
        const newRoom = new Room({ ...roomData, imageUrl: imageURI });
        return await newRoom.save();
    }

    async update(roomId, updateData) {
        const allowedUpdates = ['name', 'price', 'description', 'status', 'type'];
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
        // With Data URIs, the delete operation is simple and safe.
        const room = await Room.findByIdAndDelete(roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        return room;
    }
}

// Export a single, shared instance of the service (Singleton Pattern)
export default new RoomService();