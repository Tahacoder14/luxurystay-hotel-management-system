const RoomService = require('../services/roomService');

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public
 */
exports.getAllRooms = async (req, res, next) => {
    try {
        const rooms = await RoomService.getAll();
        res.json(rooms);
    } catch (error) {
        next(error); // Pass any errors to the central error handler
    }
};

/**
 * @desc    Get a single room by its ID
 * @route   GET /api/rooms/:id
 * @access  Public
 */
exports.getRoomById = async (req, res, next) => {
    try {
        const room = await RoomService.getById(req.params.id);
        res.json(room);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @access  Private/Admin
 */
exports.createRoom = async (req, res, next) => {
    try {
        // The controller passes the request body and the uploaded file to the service
        const newRoom = await RoomService.create(req.body, req.file);
        res.status(201).json(newRoom); // 201 Created status is a best practice
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an existing room
 * @route   PUT /api/rooms/:id
 * @access  Private/Admin
 */
exports.updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await RoomService.update(req.params.id, req.body);
        res.json(updatedRoom);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a room
 * @route   DELETE /api/rooms/:id
 * @access  Private/Admin
 */
exports.deleteRoom = async (req, res, next) => {
    try {
        const deletedRoom = await RoomService.delete(req.params.id);
        res.json({ message: `Room "${deletedRoom.name}" removed successfully` });
    } catch (error) {
        next(error);
    }
};