import type { BaseResponse } from "~/miscs/others";
import type LikesModel from "./likes.model";

export default interface LikesResponse extends BaseResponse {
    total: number
    response: LikesModel[]
}