import { LoginController } from "~/apis/auth/auth.controller"
import { Router } from "express"

const router = Router()

/**
 * @swagger
 * /apis/auth/login:
 *  post:
 *    sumarry: Allows the user to login.
 *    description: Allows the user to login.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                format: password
 *                example: "password123"
 *            required:
 *              - password
 *            oneOf:
 *              - properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "email@email.com"
 *                required:
 *                  - email
 *              - properties:
 *                username:
 *                  type: string
 *                  example: "marysue"
 *                required:
 *                  - username
 *    responses:
 *      200:
 *        description: User successfully logged in.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Login successfully."
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: "Please enter username/email and password!"
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: "Invalid username or password."
 *      404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: "User not found!"
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: "Internal server error."
 */

router.post("/apis/auth/login", LoginController)

export default router
