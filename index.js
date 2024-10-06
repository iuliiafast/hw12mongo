import dotenv from 'dotenv';
import { connectToDatabase } from './db/index.js';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start the server due to MongoDB connection issue', err);
  });
