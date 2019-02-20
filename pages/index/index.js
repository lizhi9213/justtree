//index.js

Page({
  data: {
    topBgc: 'linear-gradient(to right, #07CBC1, #02B6D7)',
    activeIndex: 0,
    stayList: [{
      id: '12a',
      houseNumber: '2栋0单元17层1704',
      stayStatus: 1,
      supportIdCard: 0,
      timeLimit: '2018-12-25 10:25 -- 2019-01-25 10:25',
      houseAddress: '北京市朝阳区惠新西街道5号院2号楼17042栋0单元17层170417'
    }, {
      id: '12b',
      houseNumber: '2栋0单元17层1704',
      stayStatus: 2,
      supportIdCard: 0,
      timeLimit: '2018-12-25 10:25 -- 2019-01-25 10:25',
      houseAddress: '北京市朝阳区惠新西街道5号院2号楼17042栋0单元17层170417'
    }, {
      id: '12c',
      houseNumber: '2栋0单元17层1704',
      stayStatus: 2,
      supportIdCard: 1,
      timeLimit: '2018-12-25 10:25 -- 2019-01-25 10:25',
      houseAddress: '北京市朝阳区惠新西街道5号院2号楼17042栋0单元17层170417'
    }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    // 判断入住单列表是否有数据，如果有就让顶部透明
    if (this.data.stayList.length != 0) {
      this.setData({
        topBgc: "url('https://img.zelkova.cn/juoss/kP8k35aTtK.png') top center no-repeat"
      })
    }
  },
  onShow: function () {
    wx.hideLoading()
  },
  toOneTimePassword: function () {
    wx.navigateTo({
      url: '../oneTimePassword/oneTimePassword'
    })
  },
  toRealPeople: function () {
    wx.navigateTo({
      url: '../realPeople/realPeople'
    })
  },
  toStayIn: function () {
    wx.navigateTo({
      url: '../toStayIn/toStayIn'
    })
  },
  selectOrder: function (event) {
    var index = event.currentTarget.dataset['index'];
    console.log(index)
    this.setData({
      activeIndex: index
    })
  }
})