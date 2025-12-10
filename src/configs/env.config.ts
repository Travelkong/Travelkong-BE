import dotenv from "dotenv"

dotenv.config()

const EnvConfig = {
  server: {
    envName: process.env.NODE_ENV,
    url: process.env.URL,
    port: process.env.PORT,
  },

  insert: {
    externalSqlPath: process.env.EXTERNAL_SQL_PATH as string,
  },

  app: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },

  database: {
    postgresqlUrl: process.env.POSTGRESQL_URL,
    mongodbUrl: process.env.MONGODB_URL,
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

  firebase: {
    type: "service_account",
    universeDomain: "googleapis.com",
    tokenUri: "https://oauth2.googleapis.com/token",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",

    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASe_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  },

  search: {
    opensearchUrl: process.env.OPENSEARCH_URL,
  },
}

export default EnvConfig
