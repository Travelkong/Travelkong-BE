import { postgresqlConnection } from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"

export default class TagsRepository {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }
}
