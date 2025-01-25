import type { BaseResponse } from "~/miscs/others";
import type { UserModel } from "./user.model";

export interface UserResponse extends BaseResponse {
    response: UserModel | UserModel[] // For 1 or more objects.
}