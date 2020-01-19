import { Context } from 'egg';
import { NotFoundLogicCodeError } from './exception';

export const router = async (ctx: Context, middlewares: Map<number, Function>) => {
  const { actionCode } = ctx;
  const middleware = middlewares.get(actionCode);
  if (!middleware) {
    throw new NotFoundLogicCodeError();
  }
  await middleware(ctx);
}
