import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
noteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INote>('Note', noteSchema); 