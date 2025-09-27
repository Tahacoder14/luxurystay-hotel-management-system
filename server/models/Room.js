const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['Single', 'Double', 'Suite', 'Deluxe'] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  // --- THE NEW FIELD ---
  // We use an enum to ensure only valid statuses can be saved.
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);