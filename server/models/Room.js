import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['Single', 'Double', 'Suite', 'Deluxe'] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  // Remove imageUrl as required, or make it optional
  imageUrl: { type: String },
  image: { type: Buffer },      // Store image as Buffer
  imageType: { type: String },  // Store MIME type
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
    default: 'Available',
  },
}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);