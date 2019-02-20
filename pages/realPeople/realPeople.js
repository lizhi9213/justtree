// pages/realPeople/realPeople.js
const {
  $Toast
} = require('../../component/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 2,
    realName: null,
    IdNumber: null,
    showResult: false, /*是否展示认证结果页面*/
    certiResults: true /*认证结果展示成功/失败*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindNameInput: function (e) {
    // 获取密码
    // console.log('姓名：' + e.detail.value)
    this.setData({
      realName: e.detail.value
    })
  },
  bindIdCardInput: function (e) {
    // console.log('身份证号：' + e.detail.value)
    this.setData({
      IdNumber: e.detail.value
    })
  },
  clearNameValue: function () {
    this.setData({
      realName: null
    })
  },
  clearNumberValue: function () {
    this.setData({
      IdNumber: null
    })
  },
  nextStep: function () {
    /*中国的身份证号校验正则*/
    let regIdNo = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    /*用的unicode字符的来进行匹配，而中国人的姓名长度一般都是2-4，所以重复匹配{2,4}次*/
    let regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (this.data.realName == null) {
      $Toast({
        content: '请填写姓名',
        type: 'warning'
      });
      return false;
    }

    if (this.data.IdNumber == null) {
      $Toast({
        content: '请填写身份证号',
        type: 'warning'
      });
      return false;
    }

    if (!regName.test(this.data.realName)) {
      $Toast({
        content: '姓名填写有误',
        type: 'warning'
      });
      return false;
    }

    if (!regIdNo.test(this.data.IdNumber)) {
      $Toast({
        content: '姓名填写有误',
        type: 'warning'
      });
      return false;
    }
    
  }
})