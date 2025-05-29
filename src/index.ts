import express from "express"
import type { Express, Request, Response } from "express"
import dotenv from "dotenv"
import http from "node:http"
import cors from "cors"
import bodyParser from "body-parser"
import "reflect-metadata"

import startServer from "./server"
import initRoutes from "./routes"
import rateLimiter from "./miscs/rateLimiter"

import { errorHandler } from "~/middlewares"

const app: Express = express()
const server: http.Server = http.createServer(app)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!")
})

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(bodyParser.json())

// Enable CORS middleware
app.use(cors())
app.options("*", cors())

// Enable JWT middleware
app.use(express.json())

// Apply rate limiter to all requests.
app.use(rateLimiter)

initRoutes(app)

// Global error handler
app.use(errorHandler)

startServer(server)
