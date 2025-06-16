import passport, { type User } from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import EnvConfig from "./env.config"
import UserRepository from "~/apis/user/user.repository"

const userRepository = new UserRepository()

export default function PassportConfig() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: EnvConfig.googlePassport.clientID!,
        clientSecret: EnvConfig.googlePassport.clientSecret!,
        callbackURL: `${EnvConfig.server.url}/apis/auth/google/callback`,
        passReqToCallback: true,
      },

      // TODO: change this into an actual implementation
      async (accessToken) => {
        console.log(accessToken)
      },
    ),
  )

  passport.serializeUser((user: User, done) => {
    done(null, user.userId)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      // TODO: Consider making it cleaner.
      const fullUser = await userRepository.findUser(id)
      const user: User = {
        userId: fullUser?.id!,
        email: fullUser?.email!,
        role: fullUser?.role!
      }

      done(null, user)
    } catch (error) {
      done(error)
    }
  })
}
