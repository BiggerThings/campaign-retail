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

export const initDB = async () => {
  const queryText = `
    -- Customers Table  
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      gender VARCHAR(20),
      dob DATE,
      province VARCHAR(100),
      campaigns_participated INTEGER[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Campaigns Table
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      total_customers_participated INTEGER DEFAULT 0
    );

    -- Stores Table
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255)
    );

    -- Transactions Table
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      source VARCHAR(100) NOT NULL,
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      store_no INTEGER NOT NULL,
      purchased_at TIMESTAMP NOT NULL,
      net_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      lines INTEGER NOT NULL DEFAULT 1,
      image_url VARCHAR(500), -- Stores the receipt image path/URL
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("✅ Customers table initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing tables", err);
  }
};
