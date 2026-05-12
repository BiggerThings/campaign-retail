import { Request, Response } from 'express';
import { CampaignModel } from '../models/campaignModel';

export const createCampaign = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ error: "Campaign name is required" });
        }
        const newCampaign = await CampaignModel.create(name);
        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(500).json({ error: "Failed to create campaign" });
    }
};

export const getAllCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await CampaignModel.findAll();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch campaigns" });
    }
};

export const getCampaignById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const campaign = await CampaignModel.findById(Number(id));

        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: `Campaign with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: campaign
        });
    } catch (error) {
        console.error('❌ Error in getCampaignById:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching campaign details.'
        });
    }
};