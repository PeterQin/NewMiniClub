import Taro, { Component, Config } from '@tarojs/taro';
import { login, setLoginUrl } from './wafer2-client-sdk';
import config from './config';
import Index from './pages/index';

import './app.scss';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  globalData = {}
  async componentDidMount() {
    setLoginUrl(config.service.loginUrl);
    const app = Taro.getCurrentPages();

    const res = await login();
    if (!res.email) {
      Taro.reLaunch({
        url: '/pages/binding/binding',
      });
    }
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/binding/binding',
      'pages/my/my',
      "pages/club/club",
      // "pages/club-detail/club-detail",
      // "pages/activity-detail/activity-detail",
      // "pages/activity-create-or-edit/activity-create-or-edit",
      // "pages/feedback/feedback",
      // "pages/feedback-list/feedback-list",
      // "pages/about/about",
      // "pages/my-activities/my-activities",
      // "pages/my-clubs/my-clubs",
      // "pages/own-activities/own-activities",
      // "pages/users/users",
      // "pages/scan/scan",
      // "pages/club-members/club-members",
      // "pages/club-activities/club-activities",
      // "pages/set-user-role/set-user-role",
      // "pages/own-clubs/own-clubs",
      // "pages/club-create-or-edit/club-create-or-edit",
      // "pages/choose-image/choose-image",
      // "pages/activity-members/activity-members",
      // "pages/activity-location/activity-location",
    ],
    window: {
      backgroundColor: '#f6f6f6',
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#f6f6f6',
      navigationBarTitleText: '小咔吧',
      navigationBarTextStyle: 'black',
    },
    'tabBar': {
      'color': '#7a7e83',
      'selectedColor': '#3cc51f',
      'borderStyle': 'black',
      'backgroundColor': '#ffffff',
      'list': [
        {
          'pagePath': 'pages/index/index',
          'iconPath': 'images/activity.png',
          'selectedIconPath': 'images/activity_hl.png',
          'text': '活动'
        },
        {
          'pagePath': 'pages/club/club',
          'iconPath': 'images/club.png',
          'selectedIconPath': 'images/club_hl.png',
          'text': '俱乐部'
        },
        {
          'pagePath': 'pages/my/my',
          'iconPath': 'images/user.png',
          'selectedIconPath': 'images/user_hl.png',
          'text': '我的'
        }
      ]
    },
    // @ts-ignore
    sitemapLocation: 'sitemap.json',
    //enablePullDownRefresh: true
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index/>;
  }
}

Taro.render(<App/>, document.getElementById('app'));
