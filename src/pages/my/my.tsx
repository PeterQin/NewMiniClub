import Taro, { Component, Config } from '@tarojs/taro';
import { Image, Text, View } from '@tarojs/components';
import { AtGrid } from 'taro-ui';

import { request } from '@wafer';
import config from '@config';
import { onFail, setGlobalData } from '@util';

import './my.scss';

export interface MyState {
  userInfo: {
    avatarUrl?: string;
    name?: string;
    email?: string;
  }
  permissions: string[];
  role: {
    name?: string
    permission?: string[]
  }
}

export default class My extends Component {
  state: MyState = {
    userInfo: {},
    permissions: [],
    role: {}
  };

  componentWillMount() {
    this.getUserInfo();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  async getUserInfo() {
    Taro.showLoading({
      title: '加载中',
    });

    try {
      const user = await request({
        url: config.service.userUrl,
        login: true,
      });

      const permissions = user.role.hasOwnProperty('permissions') ? user.role.permissions : [];
      this.setState({
        role: user.role,
        userInfo: user,
        permissions,
      });

      setGlobalData('userInfo', user);

      Taro.setStorageSync(config.userSessionKey, {
        email: user.email,
        role: user.role,
      });
    } catch (e) {
      onFail(e);
    } finally {
      Taro.hideLoading();
    }
  }

  navigate(obj) {
    Taro.navigateTo({
      url: obj.url
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
    navigationBarTitleText: '我的'
  };

  render() {
    const {
      userInfo,
      role,
      permissions
    } = this.state;

    const isAdmin = role.name == 'root';
    const isOwner = role.name == 'owner';
    const canManageClub = permissions.includes('edit-club');
    const canCreateActivity = permissions.includes('create-activity');

    const manageList = [
      canManageClub ? {
        image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
        value: '俱乐部',
        url: '/pages/own-clubs/own-clubs'
      } : null,
      canCreateActivity ? {
        image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
        value: '活动',
        url: '/pages/own-activities/own-activities'
      } : null,
      canCreateActivity ? {
        image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
        value: '创建活动',
        url: '/pages/activity-create-or-edit/activity-create-or-edit'
      } : null,
      isAdmin ? {
        image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
        value: '设置俱乐部',
        url: '/pages/set-user-role/set-user-role'
      } : null,
      isAdmin ? {
        image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
        value: '用户列表',
        url: '/pages/users/users'
      } : null,
      isAdmin ? {
        image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
        value: '反馈列表',
        url: '/pages/feedback-list/feedback-list'
      } : null
    ].filter(isNotNull);

    return (
      <View>
        <View className="userinfo">
          <Image
            className="userinfo-avatar"
            src={userInfo.avatarUrl!}
            style="background-size: cover"/>
        </View>

        <View className="name-email">
          <Text className="userinfo-nickname">{userInfo.name}</Text>
          <Text className="user-email">{userInfo.email}</Text>
        </View>

        <View className='panel'>
          <View className='panel__title'>我的</View>
          <View className='panel__content'>
            <AtGrid onClick={this.navigate} data={
              [
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                  value: '俱乐部',
                  url: '/pages/my-clubs/my-clubs'
                },
                {
                  image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                  value: '活动',
                  url: '/pages/my-activities/my-activities'
                }
              ]
            }/>
          </View>
        </View>

        {(isOwner || isAdmin) && <View className='panel'>
          <View className='panel__title'>管理</View>
          <View className='panel__content'>
            <AtGrid data={manageList}/>
          </View>
        </View>}

        <View className='panel'>
          <View className='panel__title'>其他</View>
          <View className='panel__content'>
            <AtGrid data={
              [
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                  value: '反馈',
                  url: '/pages/feedback/feedback'
                },
                {
                  image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                  value: '关于',
                  url: '/pages/about/about'
                }
              ]
            }/>
          </View>
        </View>
      </View>
    );
  }
}

export function isNotNull<T>(a: T | null): a is T {
  return a !== null;
}
