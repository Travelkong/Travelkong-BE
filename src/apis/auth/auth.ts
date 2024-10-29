import { generateAuthenticationToken } from "~/middlewares"
import jwt from "jsonwebtoken"
import express, { NextFunction, Request, Response } from "express"
const router = express.Router()

require("dotenv").config()

interface IUser extends Request {
  username: string
  email: string
}

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  // Will remove this chunk of code later.
  const token: string = generateAuthenticationToken({
    username: req.body.username,
    email: req.body.email,
  })
  res.status(200).json({ token })
  // const { username, email, password } = req.body

  // try {
  //   // Validates user's input
  //   if (!username || !email || !password) {
  //     res.status(400).json({ message: "Please fill out all required fields!"})
  //     return
  //   }
  // }
})

// This function is still useless.
function authenticateToken(req: IUser, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]
  const authToken: string | undefined = authHeader?.split(" ")[1]

  if (!authToken) return res.status(401).json({ error: "Missing token!" })
  jwt.verify(
    authToken,
    process.env.JWT_SECRET as string,
    (err: any, username: any) => {
      if (err) {
        console.log(err)
        res.status(403).json({ error: "Invalid or expired token!" })
      }

      req.username = username
      next()
    },
  )
}

router.post("/login", (req: Request, res: Response): any => {
  // Call the login function or whatever here.
})

function login(req: IUser, res: Response, next: NextFunction) {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    // Generic SQL code.
    // connection.query(SELECT * FROM accounts WHERE username = ? and password = ?, [username, password], (error, result) => {}
    res.redirect("/")
  } else {
    res.status(401).json({ error: "Please enter username and password!"})
  }

}

export default router
