import { pool } from '../db';

export const TransactionModel = {
    // CREATE a comprehensive transaction record
    create: async (
        source: string,
        customerId: number | null,
        storeNo: number,
        purchasedAt: string,
        netAmount: number,
        lines: number,
        imageUrl: string | null
    ) => {
        const query = `
      INSERT INTO transactions (source, customer_id, store_no, purchased_at, net_amount, lines, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;

        const values = [source, customerId, storeNo, purchasedAt, netAmount, lines, imageUrl];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // READ all transactions
    findAll: async () => {
        const result = await pool.query('SELECT * FROM transactions ORDER BY purchased_at DESC');
        return result.rows;
    },

    // READ single transaction by ID
    findById: async (id: number) => {
        const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        return result.rows[0];
    }
};
