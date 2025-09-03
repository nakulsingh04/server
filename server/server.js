import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { serverConfig } from './utils/config.js';

dotenv.config();

import { errorHandler, notFound } from './utils/asyncHandler.js';


import taskRoutes from './routes/tasks.js';

import { seedDatabase } from './data/seedData.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: serverConfig.cors.origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors({
  origin: serverConfig.cors.origin,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: serverConfig.rateLimit.windowMs,
  max: serverConfig.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/tasks', taskRoutes);
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
io.on('connection', (socket) => {
  socket.on('join:board', (boardId) => {
    socket.join(`board:${boardId}`);
  });

  // Leave a room
  socket.on('leave:board', (boardId) => {
    socket.leave(`board:${boardId}`);
  });

  // Handle task movement from client
  socket.on('task:move', async (data) => {
    try {
      io.emit('task:moved', {
        taskId: data.taskId,
        sourceColumnId: data.sourceColumnId,
        destinationColumnId: data.destinationColumnId,
        newIndex: data.newIndex
      });
    } catch (error) {
    }
  });

  socket.on('task:create', (data) => {
    io.emit('task:created', data);
  });

  socket.on('task:delete', (data) => {
    io.emit('task:deleted', data);
  });

  socket.on('task:update', (data) => {
    io.emit('task:updated', data);
  });

  socket.on('disconnect', () => {
  });
});

app.use(notFound);
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management';
    console.log('Connecting to MongoDB:', mongoUri);
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();
  
  // Auto-seed database in development mode
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('Development mode detected - checking for seed data...');
      const Task = mongoose.model('Task');
      const User = mongoose.model('User');
      
      // Check if database is empty
      const taskCount = await Task.countDocuments();
      const userCount = await User.countDocuments();
      
      if (taskCount === 0 && userCount === 0) {
        console.log('Database is empty - running auto-seed...');
        const result = await seedDatabase();
        console.log(`Auto-seed completed: ${result.users.length} users and ${result.tasks} tasks created`);
      } else {
        console.log(`Database already has data: ${userCount} users and ${taskCount} tasks`);
      }
    } catch (error) {
      console.error('Auto-seed error:', error);
    }
  }
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

startServer();
