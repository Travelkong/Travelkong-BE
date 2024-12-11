import z from "zod"

export default class ImageUploader {
  readonly #MAX_FILE_SIZE: number = 10000000 // 19MB
  readonly #ACCEPTED_IMAGE_TYPES: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ]

  public validateImage = (file: File) => {
    // https://stackoverflow.com/questions/72674930/zod-validator-validate-image
    return z.object({
      image: z
        .any()
        .refine((file) => file.length >= 1, { message: "Image is required." })
        .refine(
          (file) => file?.size <= this.#MAX_FILE_SIZE,
          "Max image size is 10MB.",
        )
        .refine(
          (file) => this.#ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported.",
        ),
    })
  }
}
