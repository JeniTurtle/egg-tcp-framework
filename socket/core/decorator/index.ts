import 'reflect-metadata';

import CtrlDecorator from './controller';
import DTODecorator from './dto';

import {
  CTRL_MIDDLEWARE_METADATA,
  ACTION_CODE_METADATA,
  ACTION_MIDDLEWARE_METADATA,
} from './constant';

const ctrlDecratoer = CtrlDecorator.getInstance();
const dtoDecratoer = DTODecorator.getInstance();

export * from './constant'; 

export const getMetadata = (target) => {
  const ctrlMiddleware = Reflect.getMetadata(CTRL_MIDDLEWARE_METADATA, target) || [];
  const actionCode = Reflect.getMetadata(ACTION_CODE_METADATA, target);
  const actionMiddleware = Reflect.getMetadata(ACTION_MIDDLEWARE_METADATA, target) || [];
  return {
    actionCode,
    actionMiddleware,
    ctrlMiddleware,
  };
}

export const ctrlMap = CtrlDecorator.ctrlMap;
export const respDTOMap = CtrlDecorator.respDTOMap;

export const Action = ctrlDecratoer.action;
export const Body = ctrlDecratoer.body;
export const Ctx = ctrlDecratoer.ctx;
export const App = ctrlDecratoer.app;
export const Controller = ctrlDecratoer.controller;
export const Middleware = ctrlDecratoer.middleware;
export const Field = dtoDecratoer.field;


