import { Router } from 'express';
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById // Import the new controller
} from '../controllers/campaignController';

const campaignRouter = Router();

campaignRouter.get('/', getAllCampaigns);
campaignRouter.get('/:id', getCampaignById); // GET /api/campaigns/1
campaignRouter.post('/', createCampaign);

export default campaignRouter;