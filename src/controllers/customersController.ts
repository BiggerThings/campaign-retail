import { Request, Response } from 'express';
import { CustomerModel } from '../models/customerModel';

export const createCustomer = async (req: Request, res: Response) => {
    const { first_name, last_name, gender, dob, province, campaigns_participated } = req.body;

    try {
        const newUser = await CustomerModel.create(
            first_name,
            last_name,
            gender,
            dob,
            province,
            campaigns_participated || [] // Default to empty array if not provided
        );
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error during customer creation" });
    }
};

export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        // 1. Call the model to get the data
        const customers = await CustomerModel.findAll();

        // 2. Send a success response with the data
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        // 3. Log the error for debugging in Docker
        console.error('❌ Error in getAllCustomers:', error);

        // 4. Send an error response to the client
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve customers from the database.'
        });
    }
};

export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customer = await CustomerModel.findById(Number(id));

        // Check if customer exists
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('❌ Error in getCustomerById:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching customer.'
        });
    }
};

// New Controller method to join a campaign
export const joinCampaign = async (req: Request, res: Response) => {
    const { id } = req.params; // Customer ID from URL
    const { campaign_id } = req.body; // Campaign ID from body

    try {
        const updatedCustomer = await CustomerModel.addCampaignToCustomer(Number(id), campaign_id);
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: "Could not update campaign participation" });
    }
};
