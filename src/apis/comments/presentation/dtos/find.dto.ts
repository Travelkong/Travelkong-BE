import { IsString, Matches } from "class-validator";

import { NANOID_REGEX } from "~/configs";

export class FindCommentDto {
    @IsString()
    @Matches(NANOID_REGEX, { message: "parentCommentId must be a valid nanoid" })
    id: string
}