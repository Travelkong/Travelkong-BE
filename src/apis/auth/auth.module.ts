import express from "express"
import passport from "passport"

import { ServiceContext } from "./../../routes"
import AuthController from "./auth.controller"

const router = express.Router()

export default function AuthModule(serviceContext: ServiceContext) {
  router.post("/register", AuthController.register)
  router.post("/login", AuthController.login)

  // TODO: Implement these after the email module has been set up.
  // router.put("/resetPassword", AuthController)
  // router.post("/refreshToken", AuthController)
  // router.get("/logout", AuthController)

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  )
  router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }))

  return router
}
