import { Transform } from "class-transformer"
import { IsOptional, IsString } from "class-validator"

export default class SearchPostDTO {
    @IsString()
    q = ""

    @IsOptional()
    @Transform(({ value }) => Number(value) || 0)
    page!: number

    @IsOptional()
    @Transform(({ value }) => Number(value) || 0)
    limit!: number
}
