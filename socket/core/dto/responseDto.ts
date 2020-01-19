import { BaseDTO } from './baseDto'

export abstract class ResponseDTO extends BaseDTO {
  abstract readonly code: string;
  abstract readonly respCode: string;
  abstract readonly respMsg: string;
}