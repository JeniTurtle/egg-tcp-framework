import * as fs from 'fs';
import * as path from 'path';
import * as extend from 'extend';
import { Application } from 'egg';
import baseConfig from '../config/config.default';

function config() {
  const env = (process.env.EGG_SERVER_ENV || 'local').toLowerCase();
  const config: any = {
    env,
    baseDir: path.resolve(__dirname, '..'),
    isProd: env === 'prod' || env === 'production'
  }
  const envPath = path.resolve(__dirname, `./config/config.${config.env}`);
  try {
    const tempConfig = extend(config, baseConfig(config));
    if (!fs.existsSync(envPath)) {
      return tempConfig;
    }
    extend(config, require(envPath).default(tempConfig));
  } catch (err) {
    throw err;
  }
  return config;
}

export const initConfig = (app: Application) => {
  if (!app.socketConfig) {
    app.socketConfig = config();
  }
  return app.socketConfig;
};
