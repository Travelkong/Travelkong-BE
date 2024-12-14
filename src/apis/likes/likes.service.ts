import { Logger } from "~/miscs/logger"
import LikesRepository from "./likes.repository"

interface ILikesService {
  getAll(userId: string): Promise<any>
}

class LikesService implements ILikesService {
  readonly #logger: Logger
  readonly #likesRepository: LikesRepository

  constructor() {
    this.#logger = new Logger()
    this.#likesRepository = new LikesRepository()
  }

  public getAll = async (userId: string): Promise<any> => {

  }
}

export default LikesService
