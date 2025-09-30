import Room from '../models/Room.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- PROFESSIONAL `__dirname` FIX for ES Modules ---
// This is the industry-standard way to get the current directory in an ESM file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * A professional service class to handle all room-related business logic,
 * written in modern ES Module syntax.
 */
class RoomService {
    /**
     * @desc    Retrieves all rooms from the database.
     * @returns {Promise<Array>} A list of all rooms, sorted by newest first.
     */
    async getAll() {
        return await Room.find({}).sort({ createdAt: -1 });
    }

    /**
     * @desc    Retrieves a single room by its ID.
     * @param   {string} roomId - The ID of the room to retrieve.
     * @returns {Promise<Document>} The found room document.
     */
    async getById(roomId) {
        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error('Room not found with that ID');
        }
        return room;
    }

    /**
     * @desc    Creates a new room, processing an in-memory image buffer into a Data URI.
     * @param   {object} roomData - The text data for the room.
     * @param   {object} file - The file object from multer, containing the image buffer.
     * @returns {Promise<Document>} The newly saved room document.
     */
    async create(roomData, file) {
        if (!file) {
            throw new Error('An image file is required to create a room.');
        }

        const compressedImageBuffer = await sharp(file.buffer)
            .resize(1024, 768, { fit: 'cover' })
            .jpeg({ quality: 85 })
            .toBuffer();

        const imageURI = `data:${file.mimetype};base64,${compressedImageBuffer.toString('base64')}`;

        const newRoom = new Room({
            ...roomData,
            imageUrl: imageURI 
        });

        return await newRoom.save();
    }

    /**
     * @desc    Updates an existing room's details.
     * @param   {string} roomId - The ID of the room to update.
     * @param   {object} updateData - An object containing the fields to update.
     * @returns {Promise<Document>} The updated room document.
     */
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

    /**
     * @desc    Deletes a room from the database.
     * @param   {string} roomId - The ID of the room to delete.
     * @returns {Promise<Document>} The document of the room that was deleted.
     */
    async delete(roomId) {
        // --- THE DEFINITIVE DELETE FIX ---
        // With a Data URI-based system, there is no physical file to delete from storage.
        // The delete operation is a simple, safe database command.
        
        // Use findByIdAndDelete which is atomic and reliable.
        const room = await Room.findByIdAndDelete(roomId);

        // If no room was found with that ID, throw a specific error.
        if (!room) {
            throw new Error('Room not found');
        }
        return room;
    }
}


// Export a single, shared instance of the service (Singleton Pattern) using modern ESM syntax.
export default new RoomService();