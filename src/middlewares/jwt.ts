import jwt, { type JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import type { Request, Response, NextFunction } from "express"
import type { StringValue } from "ms"

dotenv.config()

export const generateAccessToken = (userId: string): string => {
  const secretKey: string | undefined = process.env.JWT_SECRET
  if (!secretKey) {
    throw new Error("JWT_SECRET is not dedfined in .env file")
  }

  const jwtExpirationTime: StringValue = String(process.env.JWT_EXPIRATION_TIME) as StringValue ?? "1d"

  return jwt.sign({ userId }, secretKey, {
    expiresIn: jwtExpirationTime,
    algorithm: "HS512",
  })
}
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
//): Response<any, Record<string, any>> | undefined => {
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
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // Assert the type CustomRequest to the 'req' because the Request type doesn't have 'token' property,
    // then assign the decoded token to it
    (req as AuthenticatedRequest).user = { userId: decoded.userId }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." })
  }
}
