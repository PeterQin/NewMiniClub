import { extend } from './utils';
import constants from './constants';
import Session from './session';
import Taro from '@tarojs/taro';

/***
 * 表示登录过程中发生的异常
 */
export class LoginError extends Error {
  detail;

  constructor(public type, message) {
    super(message);
    this.type = type;
    this.message = message;
  }
}

/**
 * 微信登录，获取 code
 * callback(err, success)
 */
export function getWxLoginResult() {
  return Taro.login().catch((loginError) => {
      const error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
      error.detail = loginError;
      throw error;
    }
  );
}

/**
 * 默认参数
 */
const defaultOptions = {
  method: 'GET',
  loginUrl: null,
};

export interface Options {
  method?: keyof Taro.request.method;
  loginUrl?: string;
  data?: unknown;
}


/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 */
export async function login(options: Options = {}) {
  options = extend({}, defaultOptions, options);

  if (!options.loginUrl) {
    throw new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址')
  }

  const session = Session.get();

  if (session) {
    try {
      await Taro.checkSession();
      return session;
    } catch (e) {
      Session.clear();
      return doLogin();
    }
  } else {
    return doLogin();
  }

  async function doLogin() {
    // 构造请求头
    const res = await getWxLoginResult();
    const header = {};

    header[constants.WX_HEADER_CODE] = res.code;
    try {
      // 请求服务器登录地址，获得会话信息
      const result = await Taro.request({
        url: options.loginUrl!,
        header,
        method: options.method!,
        data: options.data,
      });
      const data = result.data;
      // 成功地响应会话信息
      if (data && !data.errcode && data.result.skey) {
        const res = data.result;
        if (res.skey) {
          Session.set(res);
          return res;
        } else {
          const errorMessage = `登录失败(${data.errcode})：${data.errmsg || '未知错误'}`;
          throw new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
        }

        // 没有正确响应会话信息
      } else {
        throw new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, data.errmsg);
      }
    } catch (e) {
      if (e instanceof LoginError) {
        throw e;
      } else {
        throw new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
      }
    }
  }
}

export function setLoginUrl(loginUrl) {
  defaultOptions.loginUrl = loginUrl;
}
