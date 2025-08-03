import { Router } from "express";

import { JwtMiddleware } from "~/middlewares";
import UserController from "./user.controller";

const router: Router = Router()

router.get("/current", JwtMiddleware.verifyAccessToken, UserController.currentUser)
router.get("/", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, UserController.getAll)
router.put("/", JwtMiddleware.verifyAccessToken, UserController.update)
router.delete("/:id", JwtMiddleware.verifyAccessToken, JwtMiddleware.isAdmin, UserController.delete)

export default router