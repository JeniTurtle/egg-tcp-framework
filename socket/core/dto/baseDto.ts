import { plainToClass } from 'class-transformer';

export class BaseDTO {
  constructor(private __initData: object) {}

  getInitData() {
    return this.__initData;
  }

  build() {
    return this.buildNew(this.__initData);
  }

  buildNew(data: object): BaseDTO {
    return plainToClass(this.constructor.prototype.constructor, data);
  }

  transformJSON() {
    return JSON.parse(JSON.stringify(this));
  }
}