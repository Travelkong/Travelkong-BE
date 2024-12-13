import { Logger } from "~/miscs/logger"

interface ILikesService {
  getAll(userId: string): Promise<any>
}

class LikesService implements ILikesService {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public getAll = async (userId: string): Promise<any> => {
    
  }
}

export default LikesService
