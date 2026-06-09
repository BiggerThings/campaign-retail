import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header is missing." });
        }

        const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: "Token is missing from Authorization header." });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret is not configured." });
        }

        jwt.verify(token, jwtSecret, (err) => {
            if (err) {
                return res.status(401).json({ error: "Invalid or expired token." });
            }

            next();
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};