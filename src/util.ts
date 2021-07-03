import config from './config';
import * as qcloud from './wafer2-client-sdk';
import Taro, { getApp } from '@tarojs/taro'
import moment from 'dayjs'

/**
 * 邮箱白名单
 */
const EMAIL_WHITE_LIST = [
  '912700892@qq.com', // 主要账户（超级管理员，可设置俱乐部负责人）
  'test@pcdeng.com', // 微信小程序审核时用的测试账号
];

/**
 * 格式化日期和时间
 */
export const formatTime = (date, hasSeconds = true) => {
  let formatter = 'YYYY-MM-DD HH:mm';
  if (hasSeconds) {
    formatter = 'YYYY-MM-DD HH:mm:ss';
  }
  return moment(date).format(formatter);
}

/**
 * 格式化日期
 */
export const formatDate = date => {
  const formatter = 'YYYY-MM-DD';
  return moment(date).format(formatter);
}

/**
 * 获取时间
 */
export const getTime = (date) => {
  const formatter = 'HH:mm';
  return moment(date).format(formatter);
}

/**
 * 显示短暂提示
 */
export const showTips = (message, duration = 1500) => {
  Taro.showToast({
    title: message,
    icon: 'none',
    duration,
  });
}

/**
 * 显示繁忙提示
 */
export const showBusy = text => Taro.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

/**
 * 显示成功提示
 */
export const showSuccess = text => Taro.showToast({
  title: text,
  icon: 'success'
})

/**
 * 显示失败提示
 */
export const showModal = (title, content) => {
  Taro.hideToast();

  Taro.showModal({
    title,
    content: typeof content === 'string' ? content : JSON.stringify(content),
    showCancel: false
  })
}

/**
 * 判断邮箱地址是否是 Quest 邮箱地址
 */
export const isQuestEmail = email => {
  const questEmailPattern = /[a-zA-Z0-9]+@quest.com$/ig;
  return questEmailPattern.test(email);
}

/**
 * 判断邮箱地址格式是否正确
 */
export const isEmailValid = email => isQuestEmail(email) || EMAIL_WHITE_LIST.findIndex(item => item === email) > -1

/**
 * 通用 http 请求失败处理函数
 */
export const onFail = (err) => {
  console.log('http 请求失败：', err);
  // 用户未授权，需要去绑定邮箱页
  if (err.type === 'ERR_WX_GET_USER_INFO') {
    Taro.redirectTo({
      url: '/pages/binding/binding',
    });
    return;
  }
  showModal('', err.message);
}

/**
 * 上传文件
 */
export function uploadFile(filePath, success, fail, complete) {
  const header = {};
  const { skey } = qcloud.getSession();
  header[qcloud.constants.WX_HEADER_SKEY] = skey;
  Taro.uploadFile({
    url: config.service.uploadUrl,
    filePath,
    name: 'file',
    header,

    success({data}) {
      const res = JSON.parse(data);
      success(res.result);
    },

    fail,
    complete,
  });
}

/**
 * 获取上一页
 */
export function getPrevPage() {
  const pages = Taro.getCurrentPages();
  if (pages.length > 1) {
    return pages[pages.length - 2]; // 上一个页面
  }
}

export function setGlobalData(field, data) {
  const app = getApp();
  app.globalData[field] = data
}

export function getGlobalData(field) {
  const app = getApp();
  return app.globalData[field]
}
