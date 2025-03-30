import { Router } from "express";

import { requireAdmin, verifyToken } from "~/middlewares";
import UserController from "./user.controller";

const router: Router = Router()

router.get("/current", verifyToken, UserController.getCurrentUser)
router.get("/getAll", verifyToken, requireAdmin, UserController.getAll)
router.put("/update", verifyToken, UserController.update)
router.delete("/:id", verifyToken, requireAdmin, UserController.delete)

export default router