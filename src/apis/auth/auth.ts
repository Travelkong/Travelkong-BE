import { generateAuthenticationToken } from "~/middlewares"
import jwt from "jsonwebtoken"
import express, { NextFunction, Request, Response } from "express"
import postgresqlConnection from "~/configs/postgresql.config"
const router = express.Router()
import bcrypt from "bcrypt"
import { generateUserId } from "~/miscs/helpers/generateIds"
import { RegisterDTO } from "./auth.dto"
import { ROLE } from "~/miscs/others/roles.interface"

require("dotenv").config()

interface IUser extends Request {
  username: string
  email: string
}

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterDTO>, res: Response): Promise<void> => {
    const { username, email, password } = req.body

    try {
      // Validates user's input
      if (!username || !email || !password) {
        res
          .status(400)
          .json({ message: "Please fill out all required fields!" })
        return
      }

      // Checks if the user already exists
      const existingUserQuery = "SELECT id FROM users WHERE email = $1"
      const existingUser = await postgresqlConnection.query(existingUserQuery, [
        email,
      ])
      if (existingUser.length > 0) {
        res.status(400).json({ message: "User already exists." })
        return
      }

      const hashedPassword: string = await bcrypt.hash(password, 10)
      const userId = generateUserId()
      const role: string = ROLE.USER

      const insertUserQuery = `INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING username, email`
      const newUser = await postgresqlConnection.query(insertUserQuery, [
        userId,
        username,
        email,
        hashedPassword,
        role,
      ])

      const token: string = generateAuthenticationToken({
        username: newUser[0].username,
        email: newUser[0].email,
      })

      res.status(201).json({ message: "User registered successfully", token })
    } catch (error) {
      console.error("Something went wrong: ", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },
)

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
    res.status(401).json({ error: "Please enter username and password!" })
  }
}

export default router
