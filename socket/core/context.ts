import { Context, Application } from 'egg';
import { Socket } from 'net';

export const createContext = (app: Application, body: Buffer, socket: Socket): Context | null => {
  try {
    const actionCode: number = +body.toString().slice(4, 8);
    // @ts-ignore
    const ctx: Context = app.createAnonymousContext({
      method: 'TCP',
      url: `/__tcp/bank/cmb?code=${actionCode}`,
    });
    ctx.body = null;
    ctx.actionCode = actionCode;
    ctx.tcpSocket = socket;
    ctx.reqMsg = body;
    return ctx;
  } catch (err) {
    app.logger.error(err);
  }
  return null;
}
