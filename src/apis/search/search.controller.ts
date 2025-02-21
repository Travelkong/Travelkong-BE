import type { Response, NextFunction } from "express"

import type { AuthenticatedRequest } from "~/middlewares"

const SearchController = {
  getAll: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.userId
      
    } catch (error) {
      next(error)
    }
  },
}

export default SearchController
