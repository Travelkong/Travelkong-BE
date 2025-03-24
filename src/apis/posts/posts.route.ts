import express from "express"
import PostsController from "./posts.controller"

const router = express.Router()

router.post("/add", PostsController.add)
router.put("/edit", )
router.delete("/delete", )

export default router