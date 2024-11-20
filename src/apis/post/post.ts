
import { NextFunction, Request, Response } from "express"

import { CreatePostDTO } from './post.dto'

require("dotenv").config()

export const Create = async (
    req: Request<{}, {}, CreatePostDTO>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { user_id, post_content } = req.body
        
        res.status(200).json({ message: "Testing" })
    } catch (error) {
        console.log(error)
    }
}