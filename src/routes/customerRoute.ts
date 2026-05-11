import { Router } from 'express';
import { 
    createCustomer,
    getAllCustomers,
    joinCampaign 
} from '../controllers/customersController';

const customerRoute = Router();

customerRoute.get('/', getAllCustomers);
customerRoute.post('/', createCustomer);
customerRoute.patch('/:id/join', joinCampaign);

export default customerRoute;