import { LoginController, RegisterController } from "~/apis/auth/auth.controller"
import { Router } from "express"

const router = Router()

router.post("/apis/auth/register", RegisterController)
router.post("/apis/auth/login", LoginController)

export default router
