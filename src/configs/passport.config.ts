import passport from "passport"

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

      async (request, accessToken, refreshToken, profile: GoogleProfile, done) => {
        const user = {
          userId: profile.id,
          name: profile.username,
          email: profile.emails?.[0].value ?? "",
          avatar: profile.photos?.[0].value,
          // TODO: find a better solution for this rather than just hardcoding "user" into role
          // might need to change the type of express (and/or passport).
          role: "user",
        }

        if (!user.email) throw new Error("No email found")
        return done(null, user)
      },
    ),
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: EnvConfig.facebookPassport.clientID ?? "",
        clientSecret: EnvConfig.facebookPassport.clientSecret ?? "",
        callbackURL: `${EnvConfig.server.url}/apis/auth/facebook/callback`,
        profileFields: ["id", "displayName", "photos", "email"],
      },

      async (
        accessToken,
        refreshToken,
        profile: FacebookProfile,
        done,
      ) => {
        const user = {
          userId: profile.id,
          name: profile.username,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
          role: "user", // TODO: refer to the todo section above for more info.
        }

        if (!user.email) throw new Error("No email found")
        return done(null, user)
      },
    ),
  )

  passport.serializeUser((user, done) => {
    done(null, user.userId)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const fullUser = await userRepository.findUser(id)
      const user = {
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
