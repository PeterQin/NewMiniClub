import constants from './constants';
const SESSION_KEY = `weapp_session_${constants.WX_SESSION_MAGIC_ID}`;
import Taro from '@tarojs/taro'

const Session = {
  get() {
    return Taro.getStorageSync(SESSION_KEY) || null;
  },

  set(session) {
    Taro.setStorageSync(SESSION_KEY, session);
  },

  clear() {
    Taro.removeStorageSync(SESSION_KEY);
  },
};

export default Session;
