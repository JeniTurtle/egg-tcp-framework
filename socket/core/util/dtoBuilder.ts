import { Context } from 'egg';
import { respDTOMap, DTO_FIELD_METADATA } from '../decorator';
import { BaseException, NotFoundLogicCodeError } from '../exception';

export const errorDTOBuilder = (ctx: Context, error: BaseException) => {
  const { body } = ctx;
  const bodyJSON = {
    ...body.transformJSON(),
    respCode: error.code,
    respMsg: error.msg,
  };
  const RespDto = respDTOMap.get(ctx.actionCode);
  if (!RespDto) {
    throw new NotFoundLogicCodeError();
  }
  const fieldMetadata = Reflect.getMetadata(DTO_FIELD_METADATA, RespDto);
  const responseData: any = {};
  for (const property in fieldMetadata) {
    const fieldOpts = fieldMetadata[property];
    if (!fieldOpts) {
      return;
    }
    responseData[property] = bodyJSON[property] || new Array(fieldOpts.length).join(' ');
  }
  return new RespDto.constructor(responseData).build();
}