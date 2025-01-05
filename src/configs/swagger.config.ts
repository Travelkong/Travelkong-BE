import type { SwaggerOptions } from "swagger-ui-express"
import dotenv from "dotenv"

dotenv.config()

const url: string = `${process.env.API_URL}:${process.env.API_PORT}`

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Travelkong's backend API",
      version: "1.0.0",
      description: "API documentation for the Travelkong website.",
      license: {
        name: "AGPLv3",
        url: "https://www.gnu.org/licenses/agpl-3.0.en.html",
      },
      contact: {
        name: "",
        url: "",
        email: "",
      },
    },
    servers: [
      {
        url: url,
        description: "",
      },
    ],
  },
  apis: ["~/apis/routes/**/*.ts"],
}

export default swaggerOptions
