import express from "express"
import passport from "passport"

import AuthController from "./auth.controller"
import AuthRepository from "./auth.repository"
import AuthService from "./auth.service"
import AuthValidator from "./auth.validator"
import type { ServiceContext } from "./../../routes"

const router = express.Router()

export default function AuthModule(serviceContext: ServiceContext) {
  const authRepository = new AuthRepository(serviceContext.loggerService)
  const authService = new AuthService(serviceContext.jwtService, authRepository, serviceContext.loggerService)
  const authValidator = new AuthValidator()
  const authController = new AuthController(authValidator, authService)

  router.post("/register", authController.register)
  router.post("/login", authController.login)

  // TODO: Implement these after the email module has been set up.
  // router.put("/resetPassword", AuthController)
  router.post("/refreshToken", authController.refreshAccessToken)
  router.get("/logout", authController.logout)

  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  )
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      successRedirect: "/",
      failureRedirect: "/login",
    }),
  )

  router.get(
    "/facebook",
    passport.authenticate("facebook", {
      scope: ["profile"],
    }),
  )

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
      successRedirect: "/",
      failureRedirect: "/login",
    }),
  )

  return router
}
