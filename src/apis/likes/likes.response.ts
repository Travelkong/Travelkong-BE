import { BaseResponse } from "~/miscs/others";
import { LikesModel } from "./likes.model";

export default interface LikesResponse extends BaseResponse {
    total: number
    response: LikesModel[]
}