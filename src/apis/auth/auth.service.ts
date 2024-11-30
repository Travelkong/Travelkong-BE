import { generateAccessToken } from "~/middlewares"
import { NextFunction, Request, Response } from "express"
import postgresqlConnection from "~/configs/postgresql.config"
import bcrypt from "bcrypt"
import { generateId } from "~/miscs/helpers/generateIds"
import { LoginDTO, RegisterDTO } from "./auth.dto"
import { ROLE } from "~/miscs/others/roles.interface"
import { Logger } from "~/miscs/logger"
import { BaseResponse } from "~/miscs/others"

require("dotenv").config()

const logger: Logger = new Logger()

export const RegisterService = async (
  payload: RegisterDTO,
): Promise<BaseResponse> => {
  const { username, email, password } = payload

  try {
    // Checks if the user already exists
    const existingUserQuery: string = "SELECT id FROM users WHERE email = $1"
    const existingUser = await postgresqlConnection.query(existingUserQuery, [
      email,
    ])
    if (existingUser.length > 0) {
      return {
        statusCode: 400,
        message: "User already exists.",
      }
    }

    const hashedPassword: string = await bcrypt.hash(password, 10)
    const userId = generateId()
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
      return {
        statusCode: 500,
        message: "Cannot create user",
      }
    } else {
      return {
        statusCode: 201,
        message: "User registered successfully",
      }
    }
  } catch (error: any) {
    logger.error(error)
    return {
      statusCode: 500,
      message: "Internal server error.",
    }
  }
}

export const LoginService = async (
  payload: LoginDTO
): Promise<BaseResponse> => {
  const { password } = payload
  // Only use username or password to login.
  let identifier: string | undefined =
    "username" in payload ? payload.username : payload.email

  if (!identifier || !password) {
    return {
      statusCode: 400,
      message: "Please enter username/email and password!"
    }
  }

  try {
    // Checks if the user exists in the database
    const checkUserQuery: string = `SELECT * FROM users WHERE (username = $1 OR email = $1) LIMIT 1;`
    const result = await postgresqlConnection.query(checkUserQuery, [
      identifier,
    ])

    if (!result?.length) {
      return {
        statusCode: 404,
        message: "User not found"
      }
    }

    const user = result[0]
    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      user.password,
    )
    if (!isPasswordMatch) {
      return {
        statusCode: 401,
        message: "Invalid username or password."
      }
    }

    // Generates JWT
    const token: string = generateAccessToken(user.id)
    return {
      statusCode: 200,
      message: "Login successfully",
      data: token
    }
  } catch (error: any) {
    logger.error(error)
    return {
      statusCode: 500,
      message: "Internal server error."
    }
  }
}
