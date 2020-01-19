export class BaseException extends Error {
  public readonly code: number = 100000;
  public readonly msg: string = '系统默认错误';
  public readonly error: string;

  constructor({ code, msg, error }: {
    code?: number,
    msg?: string,
    error?: string
  } = {}) {
    super(msg);
    code && (this.code = code);
    msg && (this.msg = msg);
    error && (this.error = error);
  }
}
