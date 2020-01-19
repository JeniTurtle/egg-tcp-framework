import { BaseException } from './baseException';

export class SystemError extends BaseException {
  readonly code: number = 100000;
  readonly msg: string = '系统错误';
}

export class SystemUnknownError extends SystemError {
  readonly code: number = 100001;
  readonly msg: string = '系统未知错误';
}

export class NotFoundLogicCodeError extends SystemError {
  readonly code: number = 100002;
  readonly msg: string = '找不到对应的业务编号';
}

export class LogicCodeExistsError extends SystemError {
  readonly code: number = 100003;
  readonly msg: string = '业务码已存在，请勿重复设置';
}

export class MiddlewareError extends SystemError {
  readonly code: number = 100004;
  readonly msg: string = '中间件执行异常';
}

export class MiddlewareTypeError extends SystemError {
  readonly code: number = 100005;
  readonly msg: string = '中间件类型错误';
}

export class DTOValidateError extends SystemError {
  readonly code: number = 100006;
  readonly msg: string = '数据传输对象格式检查错误';
}

