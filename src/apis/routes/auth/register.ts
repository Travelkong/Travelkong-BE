import { RegisterController } from '../../auth/auth.controller';
import { Router } from "express"

const router = Router()

/**
 * @swagger
 * /apis/auth/register:
 *  post:
 *    summary: Allows the user to register an account.
 *    description: Allows the user to register an account on the website.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: "email@email.com"
 *              username:
 *                type: string
 *                example: "marysue"
 *              password:
 *                type: string
 *                format: password
 *                example: "password123"
 *    responses:
 *      201:
 *        description: User successfully registered.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "User registered successfully."
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  example: "Invalid input data."
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
router.post("/apis/auth/register", RegisterController)

export default router