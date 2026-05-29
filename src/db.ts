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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Campaigns Table
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      total_customers_participated INTEGER DEFAULT 0
    );

    -- Campaign Participants Table
    CREATE TABLE IF NOT EXISTS campaign_participants (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
      customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
      purchase_count INTEGER DEFAULT 0,
      UNIQUE(campaign_id, customer_id) -- Prevents duplicate entries for the same customer in a campaign
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

    -- Trigger Function to increment 'total_customers_participated' automatically
    CREATE OR REPLACE FUNCTION increment_campaign_counter()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE campaigns 
      SET total_customers_participated = total_customers_participated + 1
      WHERE id = NEW.campaign_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Attach Trigger to the Junction Table
    CREATE OR REPLACE TRIGGER trg_customer_joined_campaign
    AFTER INSERT ON campaign_participants
    FOR EACH ROW
    EXECUTE FUNCTION increment_campaign_counter();

    -- Seed the default 'smmr_26' entry automatically
    INSERT INTO campaigns (name) 
    VALUES ('smmr_26') 
    ON CONFLICT (name) DO NOTHING;
  `;
  try {
    await pool.query(queryText);
    console.log("✅ All tables initialized successfully (with 'smmr_26' and participant triggers)");
  } catch (err) {
    console.error("❌ Error initializing tables", err);
  }
};
