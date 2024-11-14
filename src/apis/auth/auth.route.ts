import express from "express"
import { Login, Register } from "./auth"

const router = express.Router()

router.post("/register", Register)
router.post("/login", Login)

// TODO: Implement these after the email thingy has been set up.
router.post("/forgotPassword")
router.put("/changePassword")
