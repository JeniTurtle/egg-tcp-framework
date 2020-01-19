import { Context } from 'egg';

/**
 * 打印请求日志
 */
export const logger = async (ctx: Context, next: () => Promise<any>) => {
  try {
    const start = new Date().getTime();
    ctx.app.logger.info('[%s] 收到消息 -> %s', ctx.actionCode, ctx.reqMsg.toString());
    await next();
    const ms = new Date().getTime() - start;
    ctx.app.logger.info('[%s] 返回消息 -> %s (%s)ms', ctx.actionCode, ctx.respMsg.toString(), ms);
  } catch (err) {
    ctx.app.logger.error(err);
  }
};
