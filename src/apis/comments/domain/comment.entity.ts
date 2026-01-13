import type { CommentStatus } from "./comment-status.policy";

export default class Comment {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly level: number,
    public readonly status: CommentStatus,
    public readonly parentCommentId?: string | null,
    public readonly images?: string[] | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {
    if (!content.trim) {
      throw new Error("Content must not be empty!")
    }
  }
}
