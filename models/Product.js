import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'user' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  imgdescription: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: false },
  date: { type: Number, required: true },
  commentFinalDate: { type: Date, required: true },
  imgname: { type: String, required: true },
  point: { type: Number, required: true },
  hintShape: { type: String, required: false },
  hint: { type: String, required: false },
  pointsReceived: { type: Number, default: 0 },
  // Simplified points history
  pointHistory: [
    {
      points: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Product =
  mongoose.models.product || mongoose.model('product', productSchema);

export default Product;
