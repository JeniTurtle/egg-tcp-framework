import { msgEncode, msgDecode } from '../core';
import { logger, respHandler } from '../middleware'

export default config => {
  config.tcpServerPort = 8821;

  config.secretKey = 'I5oCbrolpr';

  config.middlewares = [ logger, respHandler, msgEncode, msgDecode ];

  return config;
}
