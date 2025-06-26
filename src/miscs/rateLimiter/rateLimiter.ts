import { rateLimit } from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many request from this IP.",
    standardHeaders: "draft-8",
    legacyHeaders: false
})

export default limiter