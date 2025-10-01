import RoomService from '../services/roomService.js';
// The Room model can be imported for type-checking or direct calls if needed in the future,
// but our "thin controller" design delegates database interaction to the service layer.
import Room from '../models/Room.js';

/**
 * @desc    Get all rooms from the database.
 * @route   GET /api/rooms
 * @access  Public
 */
export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await RoomService.getAll();
        res.json(rooms);
    } catch (error) {
        // Pass any errors to the central errorHandler middleware
        next(error);
    }
};

/**
 * @desc    Get a single room by its unique ID.
 * @route   GET /api/rooms/:id
 * @access  Public
 */
export const getRoomById = async (req, res, next) => {
    try {
        const room = await RoomService.getById(req.params.id);
        res.json(room);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new room. This is a protected admin route.
 * @route   POST /api/rooms
 * @access  Private/Admin
 */
export const createRoom = async (req, res, next) => {
    try {
        // The controller's only job is to pass the request data (body and file)
        // to the service layer, which contains all the business logic.
        const newRoom = await RoomService.create(req.body, req.file);
        
        // Return a 201 "Created" status, which is a professional REST API best practice.
        res.status(201).json(newRoom);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an existing room by its ID.
 * @route   PUT /api/rooms/:id
 * @access  Private/Admin
 */
export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await RoomService.update(req.params.id, req.body);
        res.json(updatedRoom);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a room by its ID.
 * @route   DELETE /api/rooms/:id
 * @access  Private/Admin
 */
export const deleteRoom = async (req, res, next) => {
    try {
        const deletedRoom = await RoomService.delete(req.params.id);
        // Send back a clear, professional success message.
        res.json({ message: `Room "${deletedRoom.name}" was removed successfully` });
    } catch (error) {
        next(error);
    }
};