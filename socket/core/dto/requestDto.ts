import { BaseDTO } from './baseDto'

export abstract class RequestDTO extends BaseDTO {
  abstract readonly code: number;
}