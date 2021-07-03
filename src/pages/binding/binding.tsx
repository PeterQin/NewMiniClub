import Taro, { Component, Config } from '@tarojs/taro';
import { Button, Form, Input, Text, View } from '@tarojs/components';
import { request } from '@wafer';
import config from '@config';
import { isEmailValid, onFail, showModal, showSuccess } from '@util';

import './binding.scss';

export default class Binding extends Component {
  state = {
    userEmail: '',
    isProcessing: false,
    inputFocus: false,
    isCollectingInfo: true,
    userVerifyCode: '',
  };

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  async getUserInfo(e) {
    const email = this.state.userEmail;
    if (!isEmailValid(email)) {
      showModal('格式错误', '邮箱仅支持 quest 公司邮箱');
      return;
    }

    Taro.showLoading({
      title: '请求中...',
    });

    try {
      await request({
        url: config.service.updateWxUserInfo,
        method: 'POST',
        login: true,
        data: {
          ...e.detail,
        }
      });

      await this.sendEmail();

      this.setState({
        isCollectingInfo: false,
      });
    } catch (e) {
      onFail(e);
    } finally {
      Taro.hideLoading();
    }
  }

  async sendEmail() {
    try {
      await request({
        url: config.service.sendEmailUrl,
        login: true,
        method: 'post',
        data: {
          email: this.state.userEmail
        }
      });

      showSuccess('邮件发送成功');
    } catch (e) {
      this.setState({
        isCollectingInfo: true,
      });
      onFail(e);
    }
  }

  async bind() {
    this.setState({
      isProcessing: true,
    });
    try {
      const result = await request({
        url: config.service.bindingUrl,
        login: true,
        method: 'post',
        data: {
          email: this.state.userEmail,
          verifyCode: this.state.userVerifyCode
        }
      });

      Taro.setStorageSync(config.userSessionKey, {
        email: result.email,
        role: result.role,
      });
      showSuccess(result.msg);
      Taro.reLaunch({
        url: '/pages/index/index',
      });
    } catch (e) {
      onFail(e);
    } finally {
      this.setState({
        isProcessing: false,
      });
    }
  }

  onInput(e) {
    this.setState({
      userEmail: e.detail.value,
    });
  }

  onInputFocus() {
    this.setState({
      inputFocus: true,
    });
  }

  onInputBlur() {
    this.setState({
      inputFocus: false,
    });
  }

  verifyCodeInput(e) {
    this.setState({
      userVerifyCode: e.detail.value,
    });
  }

  reset() {
    this.setState({
      isCollectingInfo: true,
      userEmail: '',
      inputFocus: false,
      userVerifyCode: '',
      isProcessing: false,
    });
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '用户绑定',
  };

  render() {
    const {
      userEmail,
      isProcessing,
      isCollectingInfo,
      inputFocus,
      userVerifyCode
    } = this.state;

    let infoBlock;

    if (isCollectingInfo) {
      infoBlock = (
        <View className="info-block">
          <Form className="login-form">
            <View className={`input-group ${inputFocus ? 'active' : ''}`}>
              <Text className="input-label">邮箱</Text>
              <Input
                type="text"
                cursorSpacing={30}
                id="userEmail"
                className="form-control"
                placeholder="公司邮箱"
                onInput={this.onInput}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                autoFocus
              />
            </View>
          </Form>

          <View>
            <Button
              className="confirm-btn"
              disabled={userEmail.length == 0 || isProcessing}
              openType="getUserInfo"
              onGetUserInfo={(event) => this.getUserInfo(event)}
            >
              发送验证码
            </Button>
          </View>
        </View>
      );
    } else {
      infoBlock = (
        <View className="info-block">
          <Form className="verify-form">
            <View style={{ marginBottom: '40rpx' }}>
              <Text className="message">
                验证码已发送至 {userEmail}
              </Text>
            </View>

            <View className={`input-group ${inputFocus ? 'active' : ''}`} style={{ padding: '25rpx 20rpx' }}>
              <Input
                cursorSpacing={30}
                className="form-control"
                type="number"
                placeholder="验证码"
                id="verificationCode"
                onInput={this.verifyCodeInput}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
              />
            </View>
          </Form>

          <View>
            <Button
              className="confirm-btn"
              disabled={isProcessing || userVerifyCode.length == 0}
              onClick={this.bind}
            >
              绑定
            </Button>
          </View>
          <View
            className="weui-cell__ft"
            style={{ marginTop: '20rpx', textAlign: 'right' }}
          >
            <Text className="message" onClick={this.reset}>
              换一个邮箱 &gt;
            </Text>
          </View>
        </View>
      );
    }

    return <View className="binding">{infoBlock}</View>;
  }
}
