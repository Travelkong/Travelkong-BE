import { Expose } from "class-transformer"

import type { CommentStatus } from "../../domain"
import { BaseResponse } from "~/miscs/others"
import { HTTP_STATUS } from "~/miscs/utils"

export class CommentResponse extends BaseResponse {
  @Expose() id: string
  @Expose() parentCommentId?: string
  @Expose() postId: string
  @Expose() userId: string
  @Expose() content: string
  @Expose() level: number
  @Expose() images?: string | string[]
  @Expose() status: CommentStatus
  @Expose() createdAt: Date
  @Expose() updatedAt?: Date
  @Expose() deletedAt?: Date

  constructor(partial: CommentResponse) {
    super(HTTP_STATUS.OK.code, HTTP_STATUS.OK.message, false)
    Object.assign(this, partial)
  }
}
