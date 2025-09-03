import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { seedDatabase } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management';
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  try {
    await connectDB();
    console.log('Starting database seeding...');
    const result = await seedDatabase();
    console.log('Database seeded successfully!');
    console.log(`Created ${result.users.length} users and ${result.tasks} tasks`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeed();
