import { BaseException } from '../exception';
import { BaseDTO } from './baseDto';

export abstract class ExceptionDTO extends BaseDTO {
  constructor(error?: BaseException) {
    super({
      respCode: error && String(error.code),
      respMsg: error?.msg,
    });
  }
  abstract readonly code: string;
  abstract readonly respCode: string;
  abstract readonly respMsg: string;
}