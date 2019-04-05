const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    showLoginDialog: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {

  },
  onShow: function () {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },

  onUserInfoClick: function () {
    if (wx.getStorageSync('token')) {

    } else {
      this.showLoginDialog();
    }
  },

  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },

  onCloseLoginDialog() {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody() {
    // 阻止冒泡
  },

  onWechatLogin(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }

    util.login().then((res) => {
      // return util.request(api.AuthLoginByWeixin, {
      //   code: res,
      //   userInfo: e.detail
      // }, 'POST');

      return util.request(api.LoginByWeixin, {
        code: res,
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl
      }, 'POST');
    }).then((res) => {
      // console.log(res)
      if (res.success !== true) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
      let userInfo = {
        name: res.data.name,
        avatar: res.data.avatar
      };
      // 设置用户信息
      this.setData({
        userInfo: userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = userInfo;
      app.globalData.token = res.data.token;
      wx.setStorageSync('userInfo', JSON.stringify(userInfo));
      wx.setStorageSync('token', res.data.token);
    }).catch((err) => {
      console.log(err)
    })
  },

  onOrderInfoClick: function (event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function (event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function () {
    let that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {

          // TODO 暂时这么处理
          that.setData({
            userInfo: {
              nickname: '点击登录',
              avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
            }
          });
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          // wx.clearStorageSync();
          // wx.switchTab({
          //   url: '/pages/index/index'
          // });
        }
      }
    })

  }
})