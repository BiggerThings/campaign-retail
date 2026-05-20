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

const app = express();
app.use(express.json());

initDB(); // Initialize the database tables

app.use(health_route);
app.use('/api/customers', customerRoute);
app.use('/api/campaigns', campaignRouter);
app.use('/api/stores', storeRoutes);
app.use('/api/transactions', transactionRoute);

const PORT = process.env.PORT;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});