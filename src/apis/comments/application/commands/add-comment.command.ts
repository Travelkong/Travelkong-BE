import type { CommentStatus } from "../../domain"

export class AddCommentCommand {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly level: number,
    public readonly status: CommentStatus,
    public readonly parentCommentId?: string | null,
    public readonly images?: string[] | null,
  ) {}
}
