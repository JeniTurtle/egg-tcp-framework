import { BaseException } from '../../core/exception';

export class TestError extends BaseException {
  readonly code: number = 110001;
  readonly msg: string = '测试错误';
}