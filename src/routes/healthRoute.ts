import express from "express";

import { healthCheckController } from "../controllers/healthCheckController";

const health_route = express.Router();

health_route.get("", healthCheckController);

export default health_route;