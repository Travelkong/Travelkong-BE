import { Logger } from "~/miscs/logger"
import TagsRepository from "./tags.repository"
import type TagsResponse from "./tags.response"

export default class TagsService {
  readonly #logger: Logger
  readonly #tagsRepository: TagsRepository

  constructor() {
    this.#logger = new Logger()
    this.#tagsRepository = new TagsRepository()
  }

  public findAll = async (): Promise<TagsResponse | undefined> => {
    try {
      const result = await this.#tagsRepository.getAll()

      if (!Array.isArray(result)) {
        return
      }

      const total: number = result.length
      return {
        statusCode: 200,
        total: total ?? 0,
        response: result,
        message: "All tags",
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public find = async (): Promise<string | undefined> => {
    try {
      const result = await this.#tagsRepository.find()
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }
}
