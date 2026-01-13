export class DeleteCommentCommand {
  constructor(public readonly id: string, public readonly isAdmin: boolean) {}
}
