import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import EnvConfig from "./env.config"

export default function PassportConfig() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: EnvConfig.googlePassport.clientID!,
        clientSecret: EnvConfig.googlePassport.clientSecret!,
        callbackURL: `${EnvConfig.server.url}/apis/auth/google/callback`,
        passReqToCallback: true,
      },
      async (accessToken) => {
        console.log("Google access token: ", accessToken)
      },
    ),
  )
}
