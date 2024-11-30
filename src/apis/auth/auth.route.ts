import express from "express"
import { Login } from "./auth.service"
import { RegisterController } from "./auth.controller"

const router = express.Router()

router.post("/register", RegisterController)
router.post("/login", Login)

// TODO: Implement these after the email thingy has been set up.
router.post("/forgotPassword")
router.put("/changePassword")

export default router
