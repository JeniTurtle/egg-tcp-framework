import { Context } from 'egg';
import { Controller, Action, Body, Ctx } from '../../core';
import { TestReqDTO, TestRespDTO } from '../../dto/demo';
import { TestError } from '../../exception/demo';

@Controller()
export default class TestController {
  @Action(2004, () => TestRespDTO)
  async test(@Body() body: TestReqDTO, @Ctx() ctx: Context) {
    const { code, studentNo, serialNo } = body;
    try {
      return {
        code,
        studentNo,
        serialNo,
        respCode: '000000',
        respMsg: '请求成功',
        studentName: '达斯堤妮斯.福特.拉拉蒂娜',
        balance: 250000,
      };
    } catch (err) {
      ctx.logger.error(err);
      throw new TestError();
    }
  }
}
