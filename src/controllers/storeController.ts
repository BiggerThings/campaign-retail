import { Request, Response } from 'express';
import { StoreModel } from '../models/storeModel';

export const createStore = async (req: Request, res: Response) => {
    const { name, location } = req.body;
    try {
        if (!name || !location) {
            return res.status(400).json({ error: "Store name and location are required" });
        }
        const newStore = await StoreModel.create(name, location);
        res.status(201).json(newStore);
    } catch (error) {
        res.status(500).json({ error: "Failed to create store" });
    }
};

export const getAllStores = async (req: Request, res: Response) => {
    try {
        const stores = await StoreModel.findAll();
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stores" });
    }
};

export const getStoreById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const store = await StoreModel.findById(Number(id));
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ error: "Server error fetching store" });
    }
};