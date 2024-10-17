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
  return jwt.sign({ username, email }, process.env.JWT_TOKEN as string, {
    expiresIn: "1d",
  })
}
