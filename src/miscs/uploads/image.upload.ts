import { Logger } from "../logger"
import ImageValidator from "./image.validator"

class ImageUploader {
  readonly #logger: Logger

  constructor() {
    this.#logger = new Logger()
  }

  public uploadFiles = async (files: File[]) => {
    try {
      const imageUrls: string[] = []
      const validationError = await ImageValidator.validateImages(files)

      if (validationError) {
        throw new Error(
          `Validation failed: ${validationError
            .map((error) => error.message)
            .join(", ")}`,
        )
      }

      const uniqueFiles = new Set(files)
      await Promise.all(
        Array.from(uniqueFiles).map(async (file) => {
          imageUrls.push(file.name)
        }),
      )

      return imageUrls
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }
    }
  }
}

export default ImageUploader
