import { Router } from "express";

import { verifyToken } from "~/middlewares";
import UserController from "./user.controller";

const router: Router = Router()

router.get("/current", verifyToken, UserController.getCurrentUser)
router.get("/getAll", verifyToken, UserController.getAll)
router.put("/updateUser", verifyToken, UserController.update)
router.delete("/:id", verifyToken, UserController.delete)

export default router