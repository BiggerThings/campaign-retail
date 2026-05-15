import { pool } from '../db';

export const StoreModel = {
    // CREATE a new store
    create: async (name: string, location: string) => {
        const query = `
      INSERT INTO stores (name, location) 
      VALUES ($1, $2) 
      RETURNING *`;
        const result = await pool.query(query, [name, location]);
        return result.rows[0];
    },

    // READ all stores
    findAll: async () => {
        const result = await pool.query('SELECT * FROM stores ORDER BY name ASC');
        return result.rows;
    },

    // READ a single store by ID
    findById: async (id: number) => {
        const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
        return result.rows[0];
    }
};