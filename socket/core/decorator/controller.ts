
import 'reflect-metadata';

import * as is from 'is-type-of';
import { bodyParser } from '../util';
import {
  CTRL_MIDDLEWARE_METADATA,
  ACTION_CODE_METADATA,
  ACTION_MIDDLEWARE_METADATA,
  ACTION_CONTEXT_PARAM_METADATA,
  ACTION_APP_PARAM_METADATA,
  ACTION_BODY_METADATA,
  PARAM_METADATA,
} from './constant';

export default class CtrlDecratoer {
  public static readonly ctrlMap = new Map();
  public static readonly respDTOMap = new Map();

  private static _instance: CtrlDecratoer;

  public static getInstance() {
    if (!CtrlDecratoer._instance) {
      CtrlDecratoer._instance = new CtrlDecratoer();
    }
    return CtrlDecratoer._instance
  }

	controller(options: {
    middleware?: Function[];
  } = {}) {
    return (target) => {
      CtrlDecratoer.ctrlMap.set(target, target.prototype);
      Reflect.defineMetadata(CTRL_MIDDLEWARE_METADATA, options.middleware || [], target);
    }
  }

  middleware(middleware: Function[] = []) {
    return (_target, _key, descriptor) => {
			Reflect.defineMetadata(ACTION_MIDDLEWARE_METADATA, middleware, descriptor.value);
			return descriptor;
		};
  }
  
  action(code: number, respType: () => any) {
    const DtoType = respType();
    is.class(DtoType) && CtrlDecratoer.respDTOMap.set(code, DtoType.prototype);

    return (target, key, descriptor) => {
      const originalMethod = descriptor.value;
      const bodyParam: any = Reflect.getMetadata(ACTION_BODY_METADATA, target[key]) || [];
      const ctxParam: any = Reflect.getMetadata(ACTION_CONTEXT_PARAM_METADATA, target[key]) || [];
      const appParam: any = Reflect.getMetadata(ACTION_APP_PARAM_METADATA, target[key]) || [];
      const paramTypes = Reflect.getMetadata(PARAM_METADATA, target, key);
      descriptor.value = async function() {
        const ctx = arguments[0];
        const { reqBodyData } = ctx;
        const params: any[] = [].slice.call(arguments);
        ctxParam.forEach(paramIndex => params[paramIndex] = ctx);
        appParam.forEach(paramIndex => params[paramIndex] = ctx.app);
        for (const paramIndex of bodyParam) {
          const type = paramTypes[paramIndex];
          ctx.body = params[paramIndex] = await bodyParser(ctx, type, reqBodyData);
        }
        const ret = await originalMethod.apply(this, params);
        if (is.class(DtoType)) {
          return new DtoType(ret).build();
        }
        return DtoType;
      }
      Reflect.defineMetadata(ACTION_CODE_METADATA, code, descriptor.value);
			return descriptor;
		};
  }

  body() {
    return (target, key, index) => {
      const bodyParam = Reflect.getMetadata(ACTION_BODY_METADATA, target[key]) || [];
      bodyParam.push(index);
      Reflect.defineMetadata(ACTION_BODY_METADATA, bodyParam, target[key]);
    }
  }

  ctx() {
    return (target, key, index) => {
      const ctxParam = Reflect.getMetadata(ACTION_CONTEXT_PARAM_METADATA, target[key]) || [];
      ctxParam.push(index);
      Reflect.defineMetadata(ACTION_CONTEXT_PARAM_METADATA, ctxParam, target[key]);
    }
  }

  app() {
    return (target, key, index) => {
      const appParam = Reflect.getMetadata(ACTION_APP_PARAM_METADATA, target[key]) || [];
      appParam.push(index);
      Reflect.defineMetadata(ACTION_APP_PARAM_METADATA, appParam, target[key]);
    }
  }
}
