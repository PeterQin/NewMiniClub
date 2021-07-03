import constants from './constants';
import Session from './session';
import Taro from '@tarojs/taro';
import { login } from './login';
import { extend } from './utils';


const buildAuthHeader = (session) => {
  const header = {};

  if (session && session.skey) {
    header[constants.WX_HEADER_SKEY] = session.skey;
  }

  return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
export class RequestError extends Error {
  constructor(public type, message) {
    super(message);
    this.type = type;
    this.message = message;
  }
}

export async function request(options) {
  if (typeof options !== 'object') {
    const message = `请求传参应为 object 类型，但实际传了 ${typeof options} 类型`;
    throw new RequestError(constants.ERR_INVALID_PARAMS, message);
  }

  const requireLogin = options.login;
  const originHeader = options.header || {};

  // 是否已经进行过重试
  let hasRetried = false;

  if (requireLogin) {
    const session = Session.get();
    if (session && session.skey) {

    }
    return doRequestWithLogin();
  }

  return doRequest();


  async function doRequestWithLogin() {
    await login();
    return doRequest();
  }

  // 实际进行请求的方法
  async function doRequest() {
    const authHeader = buildAuthHeader(Session.get());

    const response = await Taro.request(extend({}, options, {
      header: extend({}, originHeader, authHeader),
    }));

    const data = response.data;

    const errs = ['ERR_SKEY_INVALID', 'ERR_USER_NOT_LOGIN'];
    if (data && errs.includes(data.errcode)) {
      Session.clear();
      // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求
      if (!hasRetried) {
        hasRetried = true;

        return doRequestWithLogin();
      }

      throw new RequestError(data.error, '登录态已过期');
    } else {
      if (data.errcode) {
        const message = data.errmsg || '未知错误';
        throw new RequestError(data.errcode, message);
      }
      return data.result;
    }
  }
}
