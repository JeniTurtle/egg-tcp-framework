import { ExceptionDTO } from '../../core/dto';
import { MaxLength, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { Field } from '../../core/decorator';

export class DefaultErrorDTO extends ExceptionDTO {
  @Field({
    offset: 0,
    length: 4,
    description: '业务交易码',
  })
  readonly code: string = '0000';

  @Field({
    offset: 4,
    length: 6,
    description: '错误交易码',
  })
  @Type(() => String)
  readonly respCode: string;

  @Field({
    offset: 10,
    length: 34,
    description: '错误提示',
  })
  @IsDefined({ message: '错误提示不能为空' })
  @MaxLength(34, { message: '错误提示不能超过34位' })
  @Type(() => String)
  readonly respMsg: string;
}