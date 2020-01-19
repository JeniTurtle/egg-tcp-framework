import * as md5 from 'js-md5';
import { Context } from 'egg';

export const msgDecode = async (ctx: Context, next: () => Promise<any>) => {
  const { secretKey } = ctx.app.socketConfig;
  try {
    const msg = ctx.reqBody = ctx.reqMsg.toString();
    const sign = msg.slice(-8);
    const headBody = msg.slice(0, 4);
    const dataBody = msg.replace(headBody, '').replace(sign, '');
    const key = md5(dataBody + secretKey).slice(5, 13);
    if (key !== sign) {
      throw new Error('无效的签名');
    }
    ctx.reqBodyData = dataBody;
  } catch (err) {
    throw err;
  }
  await next();
}

