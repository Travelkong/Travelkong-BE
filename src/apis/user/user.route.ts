import { Router } from "express";

import { verifyToken } from "~/middlewares";
import UserController from "./user.controller";

const router: Router = Router()

router.get("/current", verifyToken, UserController.getCurrentUser)

export default router