export class AddReportCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly reason: string,
  ) {}
}
