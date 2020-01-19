import { Context } from 'egg';
import { RequestDTO } from '../core/dto';
import { BaseException, SystemUnknownError } from '../core/exception';
import { bodyBuilder, errorDTOBuilder } from '../core/util';
import { DefaultErrorDTO } from '../dto/global/error';
import { msgEncode } from '../core/middleware';

const throwGlobalError = async (ctx: Context, error: BaseException) => {
  const errorDto = new DefaultErrorDTO(error).build();
  ctx.respBody = await bodyBuilder(ctx, errorDto);
  const respMsg = await msgEncode(ctx, async () => {});
  ctx.tcpSocket.write(respMsg);
}

const throwLogicError = async (ctx: Context, error: BaseException) => {
  try {
    const respDto = errorDTOBuilder(ctx, error);
    ctx.respBody = await bodyBuilder(ctx, respDto);
    const respMsg = await msgEncode(ctx, async () => {});
    ctx.tcpSocket.write(respMsg);
  } catch (err) {
    ctx.app.logger.error(err);
    await throwGlobalError(ctx, error);
  }
}

export const throwError = async (ctx: Context, error: BaseException) => {
  ctx.app.logger.error(error);
  if (!error.code || !error.msg) {
    error = new SystemUnknownError();
  }
  try {
    if (ctx.body instanceof RequestDTO) {
      await throwLogicError(ctx, error);
    } else {
      await throwGlobalError(ctx, error);
    }
  } catch (err) {
    ctx.app.logger.error(err);
    ctx.tcpSocket.write('My socket server is seriously ill, Please call me to treat it!')
  }
}
