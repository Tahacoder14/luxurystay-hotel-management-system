import Room from '../models/Room.js';
import sharp from 'sharp';

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

    // Create a room with image compression, storing image as Buffer in MongoDB
    async create(roomData, file) {
        if (!file) {
            throw new Error('An image file is required to create a room.');
        }

        const { name, type, price, description, status } = roomData;

        // Compress and resize image in memory
        const compressedImageBuffer = await sharp(file.buffer)
            .resize(1024, 768, { fit: 'cover' })
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();

        // Create the new room document, saving the image buffer and type
        const newRoom = new Room({
            name,
            type,
            price,
            description,
            status,
            image: compressedImageBuffer,
            imageType: 'image/jpeg',
            imageUrl: '', // Will be set after save
        });

        await newRoom.save();

        // Set imageUrl to the API endpoint for this room's image
        newRoom.imageUrl = `/api/rooms/${newRoom._id}/image`;
        await newRoom.save();

        return newRoom;
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
        // No file deletion needed, image is in DB
        return room;
    }
}

export default new RoomService();