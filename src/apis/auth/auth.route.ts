import express from "express"
import AuthController from "./auth.controller"

const router = express.Router()

router.post("/register", AuthController.register)
// router.post("/login", AuthController.login)

// TODO: Implement these after the email module has been set up.
// router.post("/forgotPassword")
// router.put("/changePassword")

export default router
