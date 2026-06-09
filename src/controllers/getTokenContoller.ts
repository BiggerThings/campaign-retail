import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';

const users = [
    {
        username: "admin",
        password: "password123"
    }
];

export const getTokenController = (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "JWT secret is not configured." });
        }

        const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({
            token,
            expiresIn: 3600 // 1 hour in seconds
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

