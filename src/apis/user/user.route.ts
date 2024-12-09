import { Router } from "express";

import { verifyToken } from "~/middlewares";
import UserController from "./user.controller";

const router: Router = Router()

router.post("/current", verifyToken, UserController)