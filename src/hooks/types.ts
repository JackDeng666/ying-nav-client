export class AppError extends Error {
  public code: number
  public constructor(msg: string, code: number) {
    super(msg)
    this.code = code
  }
}
