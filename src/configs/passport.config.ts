import passport, { type User } from "passport"
import {
  Strategy as GoogleStrategy,
  type Profile as GoogleProfile,
} from "passport-google-oauth20"
import {
  Strategy as FacebookStrategy,
  type Profile as FacebookProfile,
} from "passport-facebook"
import EnvConfig from "./env.config"
import UserRepository from "~/apis/user/user.repository"

const userRepository = new UserRepository()

export default function PassportConfig() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: EnvConfig.googlePassport.clientID ?? "",
        clientSecret: EnvConfig.googlePassport.clientSecret ?? "",
        callbackURL: `${EnvConfig.server.url}/apis/auth/google/callback`,
        passReqToCallback: true,
      },

      // TODO: change this into an actual implementation
      async (accessToken, refreshToken, profile, done) => {
        // const user = {
        //   id: profile.id,
        //   name: profile.displayName,
        //   email: profile.emails?.[0].value,
        //   avatar: profile.photos?.[0].value,
        // }

        // return done(null, user)
      },
    ),
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: EnvConfig.facebookPassport.clientID ?? "",
        clientSecret: EnvConfig.googlePassport.clientSecret ?? "",
        callbackURL: `${EnvConfig.server.url}/apis/auth/facebook/callback`,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async (accessToken, refreshToken, profile: FacebookProfile, done) => {},
    ),
  )

  passport.serializeUser((user: User, done) => {
    done(null, user.userId)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const fullUser = await userRepository.findUser(id)
      const user: User = {
        userId: fullUser?.id ?? "",
        email: fullUser?.email ?? "",
        role: fullUser?.role ?? "",
      }

      done(null, user)
    } catch (error) {
      done(error)
    }
  })
}
