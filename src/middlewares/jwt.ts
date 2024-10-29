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
  return jwt.sign({ username, email }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  })
}
