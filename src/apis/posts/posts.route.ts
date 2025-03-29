import express from "express"
import PostsController from "./posts.controller"

const router = express.Router()

router.get("/:id", PostsController.get)
router.get("/getAll", PostsController.getAll)
router.post("/add", PostsController.add)
router.put("/edit", )
router.delete("/delete", )

export default router