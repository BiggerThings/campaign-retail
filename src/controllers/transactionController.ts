import { Request, Response } from 'express';
import { TransactionModel } from '../models/transactionModel';
import { pool } from '../db';

export const createTransaction = async (req: Request, res: Response) => {
    const { source, customer_id, campaign_id, store_no, purchased_at, net_amount, lines, image_url } = req.body;

    try {
        if (!source || !store_no || !purchased_at || net_amount === undefined || !lines) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        let finalCampaignId = campaign_id ? Number(campaign_id) : null;

        // Optional Feature: If no campaign_id is provided, automatically fallback to 'smmr_26'
        if (!finalCampaignId) {
            const campResult = await pool.query("SELECT id FROM campaigns WHERE name = 'smmr_26'");
            if (campResult.rows.length > 0) {
                finalCampaignId = campResult.rows[0].id;
            }
        }

        const newTransaction = await TransactionModel.create(
            source,
            customer_id ? Number(customer_id) : null,
            finalCampaignId, // Pass it down to database
            Number(store_no),
            purchased_at,
            Number(net_amount),
            Number(lines),
            image_url || null
        );

        res.status(201).json({
            success: true,
            data: newTransaction
        });
    } catch (error) {
        console.error('❌ Error logging transaction:', error);
        res.status(500).json({ error: "Failed to log transaction record." });
    }
};

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await TransactionModel.findAll();
        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch transactions." });
    }
};
