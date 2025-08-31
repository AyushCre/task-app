import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to the test database before running tests
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(MONGODB_URI);
});

// Clear the database after each test
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Disconnect from the database after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});
