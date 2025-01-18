import { Logger } from "~/miscs/logger"
import TagsRepository from "./tags.repository"
import type TagsResponse from "./tags.response"
import { generateId } from "~/miscs/helpers/generateIds"

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

  // public find = async (): Promise<string | undefined> => {
  //   try {
  //     const result = await this.#tagsRepository.find()
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       this.#logger.error(error)
  //     }
  //   }
  // }

  public add = async (name: string): Promise<TagsResponse | undefined> => {
    try {
      const isExisted = await this.#tagsRepository.isTagsExisted(name)
      if (isExisted) {
        return {
          statusCode: 409,
          total: 0,
          message: "This tag has existed.",
        }
      }

      const response: boolean | undefined = await this.#tagsRepository.add(name)
      if (response === false) {
        return {
          total: 1,
          statusCode: 201,
          message: "Tag created.",
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }
}
