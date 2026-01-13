import { Transform } from "class-transformer"
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateIf,
} from "class-validator"

import { NANOID_REGEX } from "~/configs"

export class AddCommentDto {
  @IsString()
  @Matches(NANOID_REGEX, { message: "id must be a valid nanoid" })
  id: string

  @IsString()
  @Matches(NANOID_REGEX, { message: "postId must be a valid nanoid" })
  postId!: string

  @IsString()
  @IsUUID()
  userId!: string

  @IsString()
  @MinLength(1)
  @Transform(({ value }) => value.trim())
  content!: string

  @IsNumber()
  level!: number

  @IsOptional()
  @IsString()
  @Matches(NANOID_REGEX, { message: "parentCommentId must be a valid nanoid" })
  @Transform(({ value }) => value.trim())
  parentCommentId?: string

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
