import 'reflect-metadata';
import * as lodash from 'lodash';
import { Context } from 'egg';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BaseDTO } from '../dto';
import { DTOValidateError } from '../exception';
import { DTO_FIELD_METADATA } from '../decorator'

export const bodyBuilder = async (ctx: Context, result: BaseDTO) => {
  if (result instanceof BaseDTO === false) {
    throw new DTOValidateError({ msg: `控制器返回的数据不是${BaseDTO.name}类型` });
  }
  const dto: BaseDTO = result;
  const errors = await validate(dto, { skipMissingProperties: false });
  if (errors.length) {
    throw new DTOValidateError({ msg: lodash.values(errors[0].constraints)[0] });
  }
  ctx.app.logger.info('[%s] 解析返回的数据 -> %s', ctx.actionCode, JSON.stringify(dto));
  const fieldMetadata = Reflect.getMetadata(DTO_FIELD_METADATA, result.constructor.prototype);
  const responseData: string[] = new Array();
  Object.getOwnPropertyNames(dto).forEach(property => {
    const fieldOpts = fieldMetadata[property];
    if (!fieldOpts) {
      return;
    }
    if (responseData[fieldOpts.offset]) {
      throw new DTOValidateError({ msg: `响应数据${result.constructor.name}字段索引位置有重复` });
    }
    const field = String(dto[property]);
    const overstep = fieldOpts.length - field.length;
    if (overstep < 0) {
      throw new DTOValidateError({ msg: `响应字段${result.constructor.name}[${property}]长度设置不正确` });
    }
    responseData[fieldOpts.offset] = field + new Array(overstep).join(' ');
  });
  return responseData.reduce((pre: string, next: string) => pre + next);
}