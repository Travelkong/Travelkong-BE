import { z } from "zod"

class ImageValidator {
  readonly #MAX_FILE_SIZE: number = 10000000 // 10MB
  readonly #ACCEPTED_IMAGE_TYPES: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ]

  public sizeInMB(sizeInBytes: number, decimalsNum = 2): number {
    const result = sizeInBytes / (1024 * 1024)
    return +result.toFixed(decimalsNum)
  }

  public validateImages = (files: File[]) => {
    // https://stackoverflow.com/questions/72674930/zod-validator-validate-image
    // https://github.com/colinhacks/zod/issues/387#issuecomment-1919182950
    const imageSchema = z.object({
      image: z
        .custom<FileList>()
        .refine((files) => {
          return Array.from(files ?? []).length !== 0
        }, "Image is required.")
        .refine((files) => {
          return Array.from(files ?? []).every(
            (file) => this.sizeInMB(file.size) <= this.#MAX_FILE_SIZE,
          )
        }, `The maximum image size is ${this.sizeInMB(this.#MAX_FILE_SIZE)}MB`)
        .refine((files) => {
          return Array.from(files ?? []).every((file) =>
            this.#ACCEPTED_IMAGE_TYPES.includes(file.type),
          )
        }, "File type is not supported."),
    })

    const result = imageSchema.safeParse(files)
    if (!result.success) {
      return result.error.errors
    }

    return null
  }
}

export default new ImageValidator()