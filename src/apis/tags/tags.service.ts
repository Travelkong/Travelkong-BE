import { Logger } from "~/miscs/logger"
import TagsRepository from "./tags.repository"

export default class TagsService {
  readonly #logger: Logger
  readonly #tagsRepository: TagsRepository

  constructor() {
    this.#logger = new Logger()
    this.#tagsRepository = new TagsRepository()
  }
}
