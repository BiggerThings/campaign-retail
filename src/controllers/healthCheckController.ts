import { Request, Response } from "express";

export const healthCheckController = (req: Request, res: Response) => {
    try {
        res.status(200).json({
            time: new Date().toISOString(),
            message: "Health check received 🫀🫀🫀"
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}
