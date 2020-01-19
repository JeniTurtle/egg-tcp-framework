import { MaxLength, Length, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, ResponseDTO } from '../../core';

export class TestRespDTO extends ResponseDTO {
  @Field({
    offset: 0,
    length: 4,
    description: '业务交易码',
  })
  @Type(() => String)
  readonly code: string;

  @Field({
    offset: 4,
    length: 16,
    description: '查询流水号',
  })
  @IsDefined({ message: '流水号不能为空' })
  @Length(16, 16, { message: '流水号长度不是16位' })
  @Type(() => String)
  readonly serialNo: string;

  @Field({
    offset: 20,
    length: 6,
    description: '响应码，000000表明成功，其他失败',
  })
  @IsDefined({ message: '响应码不能为空' })
  @Length(6, 6, { message: '响应码长度不是6位' })
  @Type(() => String)
  readonly respCode: string;

  @Field({
    offset: 26,
    length: 34,
    description: '响应提示',
  })
  @IsDefined({ message: '响应提示不能为空' })
  @MaxLength(34, { message: '响应提示不能超过34位' })
  @Type(() => String)
  readonly respMsg: string;

  @Field({
    offset: 60,
    length: 32,
    description: '学生编号',
  })
  @IsDefined({ message: '学生编号不能为空' })
  @MaxLength(32, { message: '学生编号不能超过32位' })
  @Type(() => String)
  readonly studentNo: string;

  @Field({
    offset: 92,
    length: 32,
    description: '学生姓名',
  })
  @IsDefined({ message: '学生姓名不能为空' })
  @MaxLength(32, { message: '学生姓名不能超过32位' })
  @Type(() => String)
  readonly studentName: string;

  @Field({
    offset: 124,
    length: 17,
    description: '账户余额（分）',
  })
  @IsDefined({ message: '账户余额不能为空' })
  @MaxLength(17, { message: '账户余额不能超过17位' })
  @Type(() => String)
  readonly balance: string;
}