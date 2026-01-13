import { Transform } from "class-transformer"
import { IsArray, IsOptional, IsString, Matches, MinLength, ValidateIf } from "class-validator"

import { NANOID_REGEX } from "~/configs"

export class EditCommentDTO {
  @IsString()
  @Matches(NANOID_REGEX, { message: "id must be a valid nanoid" })
  id: string

  @IsString()
  @MinLength(1)
  @Transform(({ value }) => value.trim())
  content: string

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => {
    const toArray = typeof value === "string" ? [value] : value
    if (Array.isArray(toArray)) {
      return toArray.map((item: string | string[]) =>
        typeof item === "string" ? item.trim() : item,
      )
    }

    return value
  })
  @IsArray()
  @IsString({ each: true })
  images?: string[] | null
}
