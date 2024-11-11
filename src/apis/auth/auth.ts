import { generateAccessToken } from "~/middlewares"
import express, { NextFunction, Request, Response } from "express"
import postgresqlConnection from "~/configs/postgresql.config"
const router = express.Router()
import bcrypt from "bcrypt"
import { generateUserId } from "~/miscs/helpers/generateIds"
import { LoginDTO, RegisterDTO } from "./auth.dto"
import { ROLE } from "~/miscs/others/roles.interface"

require("dotenv").config()

router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterDTO>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
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
      const existingUserQuery: string = "SELECT id FROM users WHERE email = $1"
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

      const insertUserQuery: string = `INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING username, email`
      const result = await postgresqlConnection.query(insertUserQuery, [
        userId,
        username,
        email,
        hashedPassword,
        role,
      ])

      if (!result.length) {
        res.status(500).json({ message: "Cannot create user" })
      } else {
        res.status(201).json({ message: "User registered successfully" })
      }
    } catch (error) {
      console.error("Something went wrong: ", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },
)

router.post(
  "/login",
  async (req: Request<{}, {}, LoginDTO>, res: Response, next: NextFunction) => {
    const { password } = req.body
    // Only use username or password to login.
    let identifier: string | undefined =
      "username" in req.body ? req.body.username : req.body.email

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Please enter username and password!" })
    }

    try {
      // Checks if the user exists in the database
      const checkUserQuery: string = `SELECT * FROM users WHERE (username = $1 OR email = $1) LIMIT 1;`
      const result = await postgresqlConnection.query(checkUserQuery, [
        identifier,
      ])

      if (!result?.length) {
        return res.status(404).json({ message: "User not found" })
      }

      const user = result[0]
      const isPasswordMatch: boolean = await bcrypt.compare(
        password,
        user.password,
      )
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password." })
      }

      // Generates JWT
      const token: string = generateAccessToken(user.id)
      res.status(200).json({ message: "Login successfully", token })
    } catch (error) {
      console.error("Something went wrong: ", error)
      res.status(500).json({ message: "Internal server error." })
    }
  },
)

export default router
