import { BaseResponse } from "~/miscs/others";
import { UserModel } from "./user.model";

export interface UserResponse extends BaseResponse {
    response: UserModel
}