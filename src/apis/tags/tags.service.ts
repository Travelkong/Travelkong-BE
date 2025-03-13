import { Logger } from "~/miscs/logger"
import TagsRepository from "./tags.repository"
import { generateId } from "~/miscs/helpers/generateIds"
import type TagsResponse from "./tags.response"
import type { BaseResponse } from "~/miscs/others"

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

      const total: number = result.length ?? 0
      return {
        statusCode: 200,
        total: total,
        response: result,
        message: "All tags",
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public findByName = async (name: string): Promise<BaseResponse | undefined> => {
    try {
      const result = await this.#tagsRepository.findByName(name)
      if (result) {
        return {
          statusCode: 200,
          message: "Tag found.",
          data: result,
        }
      }

      return {
        statusCode: 400,
        message: "No such tag was found.",
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public add = async (name: string): Promise<TagsResponse | undefined> => {
    try {
      const isExisted = await this.#tagsRepository.isTagsExisted({ name })
      if (isExisted) {
        return {
          statusCode: 409,
          message: "This tag has existed.",
        }
      }

      const id: string | undefined = generateId()
      if (!id) {
        throw new Error("Internal server error.")
      }

      const response: boolean | undefined = await this.#tagsRepository.add(id, name)
      if (response === false) {
        return {
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

  public update = async (id: string, name: string): Promise<TagsResponse | undefined> => {
    try {
      const isExisted = await this.#tagsRepository.isTagsExisted({ id, name })
      if (!isExisted) {
        return {
          statusCode: 204,
          message: "No such tag was found.",
        }
      }

      const response: boolean | undefined = await this.#tagsRepository.update(id, name)
      if (response === true) {
        return {
          statusCode: 200,
          message: "Tag updated.",
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }

  public delete = async (id: string): Promise<TagsResponse | undefined> => {
    try {
      const isExisted = await this.#tagsRepository.isTagsExisted({ id })
      if (isExisted === false) {
        return {
          statusCode: 204,
          message: "No such tag was found.",
        }
      }

      const response: boolean | undefined = await this.#tagsRepository.delete(id)
      if (response === false) {
        return {
          statusCode: 200,
          message: "Tag deleted.",
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
        throw error
      }
    }
  }
}
