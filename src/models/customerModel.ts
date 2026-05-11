import { pool } from '../db';

export const CustomerModel = {
  // CREATE: Including Gender and Campaigns Array
  create: async (
    firstName: string,
    lastName: string,
    gender: string,
    dob: string,
    province: string,
    campaignIds: number[] // Expecting an array of numbers
  ) => {
    const query = `
      INSERT INTO customers (first_name, last_name, gender, dob, province, campaigns_participated)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    
    const values = [firstName, lastName, gender, dob, province, campaignIds];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // READ: Fetch all customers
  findAll: async () => {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows;
  },

  // UPDATE: Add a campaign ID to the existing array (Non-destructive)
  addCampaignToCustomer: async (customerId: number, campaignId: number) => {
    const query = `
      UPDATE customers 
      SET campaigns_participated = array_append(campaigns_participated, $1)
      WHERE id = $2
      RETURNING *`;
    
    const result = await pool.query(query, [campaignId, customerId]);
    return result.rows[0];
  },

  // DELETE: Remove a customer
  remove: async (id: number) => {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
  }
};