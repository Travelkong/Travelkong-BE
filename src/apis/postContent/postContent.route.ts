import express from "express"

import { createPostContent } from "./postContent"

const router = express.Router()

router.post("/create", createPostContent)

export default router