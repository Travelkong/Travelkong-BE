import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'

require("dotenv").config()

export interface CustomRequest extends Request {
    token: string | JwtPayload
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const secretKey: string | undefined = process.env.JWT_SECRET
    if (!secretKey) {
        throw new Error("JWT_SECRET is not dedfined in .env file")
    }

    // Remvove the 'Bearer ' from the token
    const token = req.header('Authorization')?.replace('Bearer ', '')

    try {
        if (!token) {
            throw new Error()
        }

        // Verify the token, if it correct then it will return the decoded token
        // If it not, then nothing happen
        const decoded = jwt.verify(token, secretKey);

        // Assert the type CustomRequest to the 'req' becuase the Request type doesn't have 'token' property
        // then assigning decoded token to it
        (req as CustomRequest).token = decoded
        next()
    } catch (error) {
        return res.status(401).json({ "message": "Unauthorized" })
    }
}