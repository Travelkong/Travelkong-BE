import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"
dotenv.config()

export const generateAccessToken = (userId: string) => {
  const secretKey: string | undefined = process.env.JWT_SECRET
  if (!secretKey) {
    throw new Error("JWT_SECRET is not dedfined in .env file")
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
    algorithm: "HS256",
  })
}
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    [key: string]: any
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secretKey: string | undefined = process.env.JWT_SECRET
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in .env file")
  }

  // Remvove the 'Bearer ' from the token
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (!token) {
    return res.status(403).json({ message: "Token required!" })
  }

  try {
    // Verify the token, if it's correct then it will return the decoded token
    const decoded: any = jwt.verify(token, secretKey);

    // Assert the type CustomRequest to the 'req' because the Request type doesn't have 'token' property,
    // then assign the decoded token to it
    (req as AuthenticatedRequest).user = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}
