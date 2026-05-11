import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Ensure this is here too, just in case!

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("🔌 Attempting to connect to DB..."); // Add this to see if the file is even running

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection error:', err.stack);
  }
  console.log('✅ Connected to PostgreSQL successfully');
  release();
});