import { Transform } from "class-transformer";
import { IsString, Matches } from "class-validator";
import { NANOID_REGEX } from "~/configs";

export class AddReportDto {
    @IsString()
    @Matches(NANOID_REGEX, { message: "id must be a valid nanoid" })
    commentId: string

    @IsString()
    @Transform(({ value }) => value.trim())
    reason: string
}