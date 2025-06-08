import { ServiceContext } from './../../routes';
import express from "express"
import AuthController from "./auth.controller"
import passport from "passport"

const router = express.Router()

export default function AuthModule(serviceContext: ServiceContext) {
  router.post("/register", AuthController.register)
  router.post("/login", AuthController.login)

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  )
  router.get("/google/callback", passport.authenticate("google"))

  return router
}

// TODO: Implement these after the email module has been set up.
// router.post("/forgotPassword")
// router.put("/changePassword")
