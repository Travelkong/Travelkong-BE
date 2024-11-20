import express from "express"
import { Create } from "./post"


const router = express.Router()

router.post("/createPost", Create)
router.put("/editPost", )
router.delete("/deletePost", )

export default router