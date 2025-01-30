import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import noteRoutes from './routes/noteRoutes';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin with credentials from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB connection with options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      // Add these options for MongoDB Atlas connection
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 