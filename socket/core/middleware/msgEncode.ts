import * as md5 from 'js-md5';
import { Context } from 'egg';
import { prefixZero, getAscLength } from '../util';

export const msgEncode = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
    const { respBody, app } = ctx;
    const { secretKey } = app.socketConfig;
    const key = md5(respBody + secretKey).slice(5, 13);
    const reqBody = respBody + key;
    const byteLen = prefixZero(getAscLength(reqBody), 4);
    ctx.respMsg = Buffer.from(byteLen + reqBody);
  } catch (err) {
    throw err;
  }
  return ctx.respMsg;
}
