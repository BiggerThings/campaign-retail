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
    -- 1. Campaigns Table
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      total_customers_participated INTEGER DEFAULT 0
    );

    -- 2. Customers Table
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      gender VARCHAR(20),
      dob DATE,
      province VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Junction Table
    CREATE TABLE IF NOT EXISTS campaign_participants (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
      customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
      purchase_count INTEGER DEFAULT 0,
      UNIQUE(campaign_id, customer_id)
    );

    -- 4. Transactions Table (Added campaign_id reference)
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      source VARCHAR(100) NOT NULL,
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL, -- New field!
      store_no INTEGER NOT NULL,
      purchased_at TIMESTAMP NOT NULL,
      net_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      lines INTEGER NOT NULL DEFAULT 1,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- TRIGGER 1: Bumps up 'total_customers_participated' when a row hits campaign_participants
    CREATE OR REPLACE FUNCTION increment_campaign_counter()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE campaigns 
      SET total_customers_participated = total_customers_participated + 1
      WHERE id = NEW.campaign_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER trg_customer_joined_campaign
    AFTER INSERT ON campaign_participants
    FOR EACH ROW
    EXECUTE FUNCTION increment_campaign_counter();

    -- TRIGGER 2: Intercepts a Transaction and manages campaign_participants tracking automatically
    CREATE OR REPLACE FUNCTION process_transaction_campaign_tracking()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Only run this logic if both a customer_id and campaign_id are present on the receipt
      IF NEW.customer_id IS NOT NULL AND NEW.campaign_id IS NOT NULL THEN
        INSERT INTO campaign_participants (campaign_id, customer_id, purchase_count)
        VALUES (NEW.campaign_id, NEW.customer_id, 1)
        ON CONFLICT (campaign_id, customer_id) 
        DO UPDATE SET purchase_count = campaign_participants.purchase_count + 1;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE TRIGGER trg_on_new_transaction
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION process_transaction_campaign_tracking();

    -- Seed the default 'smmr_26' entry automatically
    INSERT INTO campaigns (name) 
    VALUES ('smmr_26') 
    ON CONFLICT (name) DO NOTHING;
  `;

  try {
    await pool.query(queryText);
    console.log("✅ Tables and Transaction-Campaign triggers initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing tables", err);
  }
};

