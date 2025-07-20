import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    points: { type: Number, default: 0 },
    awardedProducts: { type: [String], default: [] }, // Track awarded products
    hasCommented: { type: Boolean, default: false }, // Track if user has commented
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
