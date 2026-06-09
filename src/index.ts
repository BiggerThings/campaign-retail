import dotenv from 'dotenv';
dotenv.config();

import './db';

import { initDB } from './db';

import express from 'express';
import health_route from "./routes/healthRoute";
import customerRoute from './routes/customerRoute';
import campaignRouter from './routes/campaignRoute';
import storeRoutes from './routes/storeRoutes';
import transactionRoute from './routes/transactionRoutes';
import tokenRouter from './routes/getTokenRoute';

import { authMiddleware } from './middleware/auth';

const app = express();
app.use(express.json());

initDB(); // Initialize the database tables

app.use(health_route);
app.use('/api/token', tokenRouter);
app.use('/api/customers', authMiddleware, customerRoute);
app.use('/api/campaigns', authMiddleware, campaignRouter);
app.use('/api/stores', authMiddleware, storeRoutes);
app.use('/api/transactions', authMiddleware, transactionRoute);

const PORT = process.env.PORT;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});