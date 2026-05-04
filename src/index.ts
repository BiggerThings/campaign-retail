import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import health_route from "./routes/healthRoute"

const app = express();
app.use(express.json());

app.use("/health", health_route);

const PORT = process.env.PORT;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});