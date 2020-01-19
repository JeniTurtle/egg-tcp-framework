
import { Context } from 'egg';
import { bodyBuilder } from './util';

export default (Ctrl, method) => async (ctx: Context, next: Function) => {
  try {
    const controller = new Ctrl(ctx);
    const result = await controller[method](ctx);
    ctx.respBody = await bodyBuilder(ctx, result);
  } catch (err) {
    throw err;
  }
  await next();
}