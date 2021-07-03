import Taro, { Component, Config } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';
import './index.scss';
import config from '@config';
import { request } from '@wafer';
import { onFail } from '@util';

export interface IndexState {
  activities: any[]
  loaded: boolean
  ps: number
  pi: number
  totalPage: number
  isLoadingMore: boolean
}

export default class Index extends Component {
  state: IndexState = {
    /**
     * 活动列表
     */
    activities: [],
    /**
     * 第一页数据是否加载完成
     */
    loaded: false,
    /**
     * 每一页多少条记录
     */
    ps: 10,
    /**
     * 当前页
     */
    pi: 1,
    /**
     * 总页数
     */
    totalPage: 2,
    /**
     * 是否在加载下一页数据中
     */
    isLoadingMore: false,
  };

  async componentWillMount() {
    Taro.showLoading({
      title: '加载中',
    });

    await this.getActivities();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  async onPullDownRefresh() {
    console.log('test');
    this.setState({
      pi: 1,
    }, async () => {
      Taro.showNavigationBarLoading();

      await this.getActivities();

      Taro.hideNavigationBarLoading();
      Taro.stopPullDownRefresh();
    });
  }

  async onReachBottom() {
    if (this.state.isLoadingMore || this.state.pi === this.state.totalPage) {
      return;
    }
    this.setState({
      pi: this.state.pi + 1,
      isLoadingMore: true,
    }, async function () {
      await this.getActivities();

      this.setState({
        isLoadingMore: false,
      });
    });
  }

  async getActivities() {
    try {
      const res = await request({
        url: `${config.service.activitiesUrl}?ps=${this.state.ps}&pi=${this.state.pi}`,
        login: true,
      });
      let activities: any[] = [];
      if (this.state.pi > 1) { // 加载更多
        activities = [...this.state.activities, ...res.data];
      } else {
        activities = res.data;
      }
      this.setState({
        activities: activities,
        totalPage: res.lastPage,
        pi: res.currentPage,
      });
    } catch (e) {
      onFail(e);
    } finally {
      Taro.hideLoading();
    }
  }

  toDetailPage() {

  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      'van-card': '../../components/vant-weapp/card/index',
      'van-tag': '../../components/vant-weapp/tag/index',
      'van-loading': '../../components/vant-weapp/loading/index',
    },
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  };

  render() {
    const { activities, loaded, isLoadingMore, pi, totalPage } = this.state;

    return (
      <View className="index">
        <View className="activities">
          {
            activities.map(item =>
              <View key={item.id}>
                <van-card
                  custom-class="activity-item"
                  thumb-mode="aspectFill"
                  tag={item.status}
                  title={item.name}
                  thumb={item.logo ? item.logo : '/images/logo@2x.png'}
                  lazy-load={true}
                  data-activity-id={item.id}
                  onClick={this.toDetailPage}>
                  <slot name="tags" className="tags">
                    <van-tag plain type="primary">{item.clubName}</van-tag>
                    <van-tag plain type="primary">{item.joinedNumbers ? item.joinedNumbers : 0} 人参加</van-tag>
                  </slot>
                </van-card>
              </View>
            )
          }
        </View>

        {loaded && activities.length === 0 && <View className="no-records">暂无活动</View>}

        {
          activities.length > 0 && <View className="loading-more-wrapper">
            {isLoadingMore && <van-loading type="spinner"/>}
            {!isLoadingMore && pi >= totalPage && <Text>---没有更多了---</Text>}
          </View>
        }
      </View>
    );
  }
}
