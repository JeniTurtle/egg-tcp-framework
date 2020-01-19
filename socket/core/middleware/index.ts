import { Application } from 'egg';
import {
  ctrlMap,
  getMetadata,
} from '../decorator';
import ctrlHandler from '../controller';
import { LogicCodeExistsError, MiddlewareError, MiddlewareTypeError } from '../exception';

export * from './msgDecode';
export * from './msgEncode';

export const getMiddlewares = (app: Application) => {
  const actionMapping = new Map<number, Function>();
  for (const Ctrl of ctrlMap.values()) {
    const { socketConfig } = app;
    const { ctrlMiddleware } = getMetadata(Ctrl.constructor);
		const methodNames = Object.getOwnPropertyNames(Ctrl).filter(property => {
      return typeof Ctrl[property] === 'function' && property !== 'constructor';
    });

    for (const property of methodNames) {
      const { actionMiddleware, actionCode } = getMetadata(Ctrl[property]);
      
      if (!actionCode) {
        continue;
      }
      if (actionMapping.has(actionCode)) {
        throw new LogicCodeExistsError({ msg: `业务码(${actionCode})已存在，请勿重复设置` });
      }
      const middlewares: Function[] = [].concat(socketConfig.middlewares, ctrlMiddleware, actionMiddleware);
      middlewares.push(ctrlHandler(Ctrl.constructor, property));
      actionMapping.set(actionCode, compose(middlewares));
    }
  }
  return actionMapping;
}

export function compose (middleware: Function[]) {
  if (!Array.isArray(middleware)) {
    throw new MiddlewareTypeError({ msg: '中间件堆栈必须是数组类型' });
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new MiddlewareTypeError({
      msg: '中间件必须为函数类型',
    });
  }

  return (context, next = () => {}) => {
    let index = -1;
    const dispatch = (i: number) => {
      if (i <= index) return Promise.reject(new MiddlewareError({
        msg: 'next()方法重复调用',
      }));
      index = i;
      let fn = middleware[i];

      if (i === middleware.length) {
        fn = next;
      }
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(context, () => {
          return dispatch(i + 1);
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0);
  }
}


