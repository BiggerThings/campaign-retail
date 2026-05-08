import express from "express";

import { healthCheckController } from "../controllers/healthCheckController";

const health_route = express.Router();

health_route.get("/health", healthCheckController);

export default health_route;