import dotenv from "dotenv"
dotenv.config()

const EnvConfig = {
  server: {
    envName: process.env.NODE_ENV,
    url: process.env.URL,
    port: process.env.PORT,
  },

  app: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },

  database: {
    postgresqlUrl: process.env.POSTGRESQL_URL,
  },

  uploads: {
    uploadPath: process.env.UPLOADS_PATH,
    maxFileSize: process.env.MAX_UPLOAD_FILE_SIZE,
  },

  googlePassport: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  facebookPassport: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
  },

  opensearchUrl: process.env.OPENSEARCH_URL,
}

export default EnvConfig
