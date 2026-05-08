import { Request, Response } from "express";

export const healthCheckController = (req: Request, res: Response) => {
    try {
        console.log("Health check received ✅✅✅")
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
