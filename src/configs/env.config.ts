import dotenv from "dotenv"
dotenv.config()

const EnvConfig = {
  server: {
    envName: process.env.NODE_ENV,
    url: process.env.URL,
    port: process.env.PORT,
  },

  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION_TIME,
  },

  database: {
    postgresqlUrl: process.env.POSTGRESQL_URL,
  },

  uploads: {
    uploadPath: process.env.UPLOADS_PATH,
    maxFileSize: process.env.MAX_UPLOAD_FILE_SIZE,
  },

  opensearchUrl: process.env.OPENSEARCH_URL,
}

export default EnvConfig
