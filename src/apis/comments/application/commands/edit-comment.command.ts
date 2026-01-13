export class EditCommentCommand {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly images?: string[] | null,
  ) {}
}
