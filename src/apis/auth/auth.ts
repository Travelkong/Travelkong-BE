// The ~/ import doesn't work for some reason
import { generateAuthenticationToken } from '~/middlewares'
import jwt from "jsonwebtoken"
import express, { NextFunction, Request, Response } from "express"
const router = express.Router()

require("dotenv").config()

interface IUser extends Request {
  username: string
  email: string
}

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const token: string = generateAuthenticationToken({
    username: req.body.username,
    email: req.body.email,
  })
  res.status(200).json(token)
})

function authenticateToken(req: IUser, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]
  const authToken: string | undefined = authHeader?.split(" ")[1]

  if (!authToken) return res.status(401).send("Invalid token")
  jwt.verify(
    authToken,
    process.env.JWT_TOKEN as string,
    (err: any, username: any) => {
      if (err) {
        console.log(err)
        res.status(403)
      }

      req.username = username
      next()
    },
  )
}

export default router