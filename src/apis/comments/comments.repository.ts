import { Logger } from "~/miscs/logger"

export default class CommentsRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public get = async (id: string) => {
    
  }
}
