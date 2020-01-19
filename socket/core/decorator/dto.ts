
import 'reflect-metadata';

import {
  DTO_FIELD_METADATA,
} from './constant';

export default class DtoDecratoer {
  private static _instance: DtoDecratoer;

  public static getInstance() {
    if (!DtoDecratoer._instance) {
      DtoDecratoer._instance = new DtoDecratoer();
    }
    return DtoDecratoer._instance
  }

	field(opts: {
    offset: number;
    length: number;
    name?: string;
    description?: string;
    default?: any;
  }) {
    return (target, key) => {
      const dtoMetadata = Reflect.getMetadata(DTO_FIELD_METADATA, target) || {};
      dtoMetadata[key] = opts;
      Reflect.defineMetadata(DTO_FIELD_METADATA, dtoMetadata, target);
    }
  }
}
