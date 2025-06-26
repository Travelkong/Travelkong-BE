import type { BaseResponse } from "~/miscs/others";

export default interface AuthResponse extends BaseResponse {
    accessToken?: string
    refreshToken?: string
}