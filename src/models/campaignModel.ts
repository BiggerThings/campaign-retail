import { pool } from '../db';

export const CampaignModel = {
    // CREATE a new campaign
    create: async (name: string) => {
        const query = `
      INSERT INTO campaigns (name, total_customers_participated) 
      VALUES ($1, 0) 
      RETURNING *`;
        const result = await pool.query(query, [name]);
        return result.rows[0];
    },

    // READ all campaigns
    findAll: async () => {
        const result = await pool.query('SELECT * FROM campaigns ORDER BY id ASC');
        return result.rows;
    },

    // READ a single campaign
    findById: async (id: number) => {
        const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
        return result.rows[0];
    }
};