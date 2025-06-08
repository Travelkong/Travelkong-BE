import jwt from "jsonwebtoken"
import EnvConfig from "~/configs/env.config"
import type { StringValue } from "ms"
import crypto from "node:crypto"

export default class JwtService {
  public generateAccessToken = (
    userId: string,
    email: string,
    role: string,
  ): string => {
    const secretKey: string = EnvConfig.app.jwtAccessSecret as string
    const secret = Buffer.from(secretKey, "base64")
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in .env file")
    }

    const expirationTime: StringValue =
      (String(EnvConfig.app.jwtAccessExpiration) as StringValue) ?? "15m"
    return jwt.sign({ userId, email, role }, secret as jwt.Secret, {
      expiresIn: expirationTime,
      algorithm: "HS512",
    })
  }

  public generateRefreshToken = (
    userId: string,
    email: string,
  ): { token: string; tokenId: string } => {
    const secretKey = EnvConfig.app.jwtRefreshSecret as string
    const secret = Buffer.from(secretKey, "base64")

    const expirationTime: StringValue =
      (String(EnvConfig.app.jwtRefreshExpiration) as StringValue) ?? "7d"

    const tokenId = crypto.randomBytes(32).toString("base64")
    const token = jwt.sign({ userId, email, tokenId }, secret as jwt.Secret, {
      expiresIn: expirationTime,
      algorithm: "HS512",
    })

    return { token, tokenId }
  }
}
