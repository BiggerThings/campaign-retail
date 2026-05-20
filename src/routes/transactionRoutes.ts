import { Router } from 'express';
import { createTransaction, getAllTransactions } from '../controllers/transactionController';

const transactionRoute = Router();

transactionRoute.get('/', getAllTransactions);
transactionRoute.post('/', createTransaction);

export default transactionRoute;