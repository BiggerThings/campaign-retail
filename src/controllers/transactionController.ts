import { Request, Response } from 'express';
import { TransactionModel } from '../models/transactionModel';

export const createTransaction = async (req: Request, res: Response) => {
    const { source, customer_id, store_no, purchased_at, net_amount, lines, image_url } = req.body;

    try {
        // Basic validation for required fields
        if (!source || !store_no || !purchased_at || net_amount === undefined || !lines) {
            return res.status(400).json({
                error: "Missing required fields: source, store_no, purchased_at, net_amount, and lines are mandatory."
            });
        }

        const newTransaction = await TransactionModel.create(
            source,
            customer_id ? Number(customer_id) : null,
            Number(store_no),
            purchased_at, // Expected format: "2026-05-20T14:30:00Z" or "2026-05-20"
            Number(net_amount),
            Number(lines),
            image_url || null
        );

        res.status(201).json({
            success: true,
            data: newTransaction
        });
    } catch (error) {
        console.error('❌ Error creating transaction:', error);
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
