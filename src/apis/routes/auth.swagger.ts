import AuthController from "~/apis/auth/auth.controller"
import { Router } from "express"

const router = Router()

router.post("/apis/auth/register", AuthController.register)
router.post("/apis/auth/login", AuthController.login)

export default router
