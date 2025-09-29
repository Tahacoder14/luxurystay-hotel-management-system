import RoomService from '../services/roomService.js';
import Room from '../models/Room.js';

// Create Room
export const createRoom = async (req, res, next) => {
    try {
        const room = await RoomService.create(req.body, req.file);
        res.status(201).json(room);
    } catch (error) {
        next(error);
    }
};

// Get all rooms
export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await RoomService.getAll();
        res.json(rooms);
    } catch (error) {
        next(error);
    }
};

// Get room by ID
export const getRoomById = async (req, res, next) => {
    try {
        const room = await RoomService.getById(req.params.id);
        res.json(room);
    } catch (error) {
        next(error);
    }
};

// Serve the room image
export const getRoomImage = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room && room.image && room.imageType) {
            res.set('Content-Type', room.imageType);
            res.send(room.image);
        } else {
            res.status(404).send('No image found');
        }
    } catch (error) {
        next(error);
    }
};