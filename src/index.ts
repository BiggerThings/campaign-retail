import dotenv from 'dotenv';
dotenv.config();

import './db';

import { initDB } from './db';

import express from 'express';
import health_route from "./routes/healthRoute";
import customerRoute from './routes/customerRoute';

const app = express();
app.use(express.json());

initDB(); // Initialize the database tables

app.use(health_route);
app.use('/api/customers', customerRoute);

const PORT = process.env.PORT;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});