import { Response, NextFunction } from "express"
import { AuthenticatedRequest } from "~/middlewares"

class LikesController {

  constructor() {

  }

  public getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  }

  public add = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  }

  public remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  }
}

export default new LikesController()
