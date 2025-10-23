import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const interviewSchema = new mongoose.Schema({
  position: { type: String, required: true },
  description: { type: String, required: true },
  experience: { type: Number, required: true },
  techStack: { type: String, required: true },
  questions: [questionSchema],
  userId: {
    type: String, 
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;