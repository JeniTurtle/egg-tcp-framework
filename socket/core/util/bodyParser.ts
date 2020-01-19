import 'reflect-metadata';
import * as lodash from 'lodash';
import { Context } from 'egg';
import { plainToClass }from 'class-transformer'
import { validate } from 'class-validator';
import { DTOValidateError } from '../exception';
import { DTO_FIELD_METADATA } from '../decorator';

export const bodyParser = async (ctx: Context, target, dataBody: string) => {
  const propertiesMetaData: {
    [prop: string]: {
      offset: number;
      length: number;
      default?: any;
    }
  } = Reflect.getMetadata(DTO_FIELD_METADATA, target.prototype);

  const tempObj: any = {};
  for (const key in propertiesMetaData) {
    const metadata = propertiesMetaData[key];
    const { offset, length, default: defaultValue } = metadata;
    let field = dataBody.slice(offset, offset + length);
    if (field.length !== length) {
      throw new DTOValidateError({ msg: `请求字段(${target.name}[${key}])长度不正确` });
    }
    field = field.replace(' ', '');
    tempObj[key] = field === '' ? defaultValue : field;
  }
  const dto = plainToClass(target, tempObj);
  const errors = await validate(dto, { skipMissingProperties: false });
  if (errors.length) {
    throw new DTOValidateError({ msg: lodash.values(errors[0].constraints)[0] });
  }
  ctx.app.logger.info('[%s] 解析收到的数据 -> %s', ctx.actionCode, JSON.stringify(dto));
  return dto;
}