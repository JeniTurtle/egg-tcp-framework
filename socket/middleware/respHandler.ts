import { Context } from 'egg';
import { throwError } from '../helper/throwError';

/**
 * 捕获控制器抛出的错误。
 */
export const respHandler = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
    ctx.tcpSocket.write(ctx.respMsg);
  } catch (err) {
    await throwError(ctx, err);
  }
}
