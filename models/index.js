import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, required: true },
  time: { type: Date }
});

export default mongoose.model('item', itemSchema);
