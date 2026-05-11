import { Router } from 'express';
import {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    joinCampaign
} from '../controllers/customersController';

const customerRoute = Router();

customerRoute.get('/', getAllCustomers);
customerRoute.get('/:id', getCustomerById);
customerRoute.post('/', createCustomer);
customerRoute.patch('/:id/join', joinCampaign);

export default customerRoute;