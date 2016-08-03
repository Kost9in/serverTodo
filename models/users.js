import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  login: { type: String, required: true },
  password: { type: String, required: true },
  time: { type: Date }
});

export default mongoose.model('user', userSchema);
