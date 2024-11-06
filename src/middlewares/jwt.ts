import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const generateAuthenticationToken = ({
  username,
  email,
}: {
  username: string
  email: string
}) => {
  const secretKey: string | undefined = process.env.JWT_SECRET
  if (!secretKey) {
    throw new Error("JWT_SECRET is not dedfined in .env file")
  }

  return jwt.sign({ username, email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
    algorithm: "HS256",
  })
}
