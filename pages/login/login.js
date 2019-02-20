// login.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    countDown: false,
    countDownNum: 30,
    timerId: null,
    resendMsg: false,
    focusIndex: 0,
    account: '',
    verification: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    }


    if (this.data.hasUserInfo) {
      this.submitLogin()
    } else {
      console.log('用户拒绝授权')
    }
  },

  bindUserInput: function (e) {
    // 获取用户名
    console.log('用户名：' + e.detail.value)
    this.setData({
      account: e.detail.value
    })
  },

  bindKeyInput: function (e) {
    // 获取密码
    console.log('验证码：' + e.detail.value)
    this.setData({
      verification: e.detail.value
    })
  },

  getFocus: function (event) {
    var index = event.currentTarget.dataset['index'];
    this.setData({
      focusIndex: index
    })
  },

  inputBlur: function () {
    this.setData({
      focusIndex: 0
    })
  },

  getVerificationCode: function () {
    let that = this;
    if (this.data.timerId) {
      // console.log('已经存在定时器');
      return;
    }
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      countDown: true,
      timerId: setInterval(function () { //这里把setInterval赋值给变量名为timerId的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timerId);
          //关闭定时器之后，将计时复位为30，并清除存储的id，标记重新发送
          that.setData({
            timerId: null,
            countDownNum: 30,
            resendMsg: true
          })
        }
      }, 1000)
    })
  },


  submitLogin: function () {
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.switchTab({
      url: '../index/index',
    })
  }
})