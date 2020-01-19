import { MaxLength, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, RequestDTO } from '../../core';

export class TestReqDTO extends RequestDTO {
  @Field({
    offset: 0,
    length: 4,
    description: '业务交易码',
  })
  @Type(() => Number)
  readonly code: number;

  @Field({
    offset: 4,
    length: 16,
    description: '查询流水号',
  })
  @Length(16, 16, { message: '流水号长度不是16位' })
  readonly serialNo: string;

  @Field({
    offset: 20,
    length: 32,
    description: '学生编号',
  })
  @MaxLength(32, { message: '学生编号不能超过32位' })
  readonly studentNo: string;
}