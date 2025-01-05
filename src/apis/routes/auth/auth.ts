import { Router } from "express"

const router = Router()

/**
 * @swagger
 * /auth/register:
 *  get:
 *   summary: Allows the user to register an account.
 *   description: Allows the user to register an account on the website.
 *   responses:
 *    201:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *         properties:
 *          message:
 *           type: string
 *           example: "Testing"
 */
router.post("/auth/register", (req, res) => {
  res.json({ message: "Testing" })
})

export default router