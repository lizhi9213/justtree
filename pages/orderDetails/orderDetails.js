// pages/orderDetails/orderDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBgc: "url('https://img.zelkova.cn/juoss/kP8k35aTtK.png') top center no-repeat",
    orderDetail: {
      id: '12a',
      houseNumber: '2栋0单元17层1704',
      stayStatus: 4,
      supportIdCard: 0,
      timeLimit: '2018-12-25 10:25 -- 2019-01-25 10:25',
      houseAddress: '北京市朝阳区惠新西街道5号院2号楼17042栋0单元17层170417',
      orderNo: '201928374',
      lockMode: ['手机一键开锁', '手机一键开锁'],
      tenants: [{
        name: '张三',
        stayStatus: 2,
        phone: '15736293253',
        IdNo: '522136********7536'
      }, {
        name: '张三',
        stayStatus: 1,
        phone: '15736293253'
      }]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})