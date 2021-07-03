/**
 * 小程序配置文件
 */

/**
 * API 地址
 */
const host = 'https://api.quest.ink';

/**
 * 小程序 API 端点
 */
const endPoint = `${host}/weapp`;

export default {
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${endPoint}/login`,
    // 发送验证码邮件
    sendEmailUrl: `${endPoint}/sendemail`,
    // 微信小程序绑定公司邮箱
    bindingUrl: `${endPoint}/binding`,

    // 测试的信道服务地址
    tunnelUrl: `${endPoint}/tunnel`,

    // 上传图片接口
    uploadUrl: `${endPoint}/upload`,

    // 俱乐部接口
    clubUrl: `${endPoint}/clubs`,
    clubDetailUrl: `${endPoint}/club`,
    setUserRoleUrl: `${endPoint}/club/set-user-role`,
    joinClubUrl: `${endPoint}/join-club`,
    quitClubUrl: `${endPoint}/quit-club`,
    joinClugLogsUrl: `${endPoint}/join-clubs/logs`,
    ownClubsUrl: `${endPoint}/own/clubs`,
    createClubUrl: `${endPoint}/club`,
    updateClubUrl: `${endPoint}/club`,

    // 活动接口
    activitiesUrl: `${endPoint}/activities`,
    activityDetailUrl: `${endPoint}/activity`,
    joinActivityUrl: `${endPoint}/join-activity`,
    createActivityUrl: `${endPoint}/activity`,
    deleteActivityUrl: `${endPoint}/activity`,
    retreatActivityUrl: `${endPoint}/retreat-activity`,
    updateActivityUrl: `${endPoint}/activity`,
    generateWxacodeUrl: `${endPoint}/generate-wxacode`,

    // 反馈接口
    feedbackUrl: `${endPoint}/feedback`,
    feedbackListUrl: `${endPoint}/feedbacks`,

    // 我参加的俱乐部
    myActivitiesUrl: `${endPoint}/my/activities`,
    // 我加入的俱乐部
    myClubsUrl: `${endPoint}/my/clubs`,
    // 我上传的图片
    myImages: `${endPoint}/my/images`,
    // 我创建的活动
    ownActivitiesUrl: `${endPoint}/own/activities`,

    // 用户
    usersUrl: `${endPoint}/users`,
    // 我的页面
    userUrl: `${endPoint}/my`,
    userSearchUrl: `${endPoint}/user/search`,
    updateWxUserInfo: `${endPoint}/wxuser`,

    // 扫码
    qrcodeStatusUrl: `${endPoint}/login/qrcode/status`,
  },
  // 用户登录信息 Session key
  userSessionKey: 'miniclub-user'
};
