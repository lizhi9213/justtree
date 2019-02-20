var bluetoothService = require('../../service/BLockBluetoothOpenDoorService.js');
var base64 = require('../../utils/base64.js');
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
      list:'',
      roomListUrl: app.globalData.pmsDomain + '?op=YTaskListV2',
      cmdUrl: app.globalData.pmsDomain + '?op=YGetBleKey',
      houseId:'',
      isOpen: false
    },
    onPullDownRefresh: function () {
      var that = this;
      var value = wx.getStorageSync(app.globalData.userInfo);     
      wx.showNavigationBarLoading() //在标题栏中显示加载
      //模拟加载
      setTimeout(function () { 
        wx.request({
          url: that.data.roomListUrl,
          data: {
            userId: value.userId,
            deviceId: 123456,
            code: value.code,
            token: value.token,
            offset: 0,
            limit: 1000
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var lList = {};
            for (var o in res.data.data.list) {
              lList[o] = res.data.data.list[o];
              if (res.data.data.list[o].tasks[0]) {
                lList[o].task = res.data.data.list[o].tasks[0];
              } else {
                lList[o].task = {};
              }
              if (res.data.data.list[o].rooms) {
                for (var i in res.data.data.list[o].rooms) {
                  lList[o].rooms[i] = res.data.data.list[o].rooms[i];
                  if (res.data.data.list[o].rooms[i].tasks[0]) {
                    res.data.data.list[o].rooms[i].task = res.data.data.list[o].rooms[i].tasks[0];
                  } else {
                    res.data.data.list[o].rooms[i].task = {}
                  }
                }
              }
            }
            that.setData({
              list: res.data.data.list
            })
          }
        });
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }, 1500);
    },
    
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      var value = wx.getStorageSync(app.globalData.userInfo);
      if (value){
        wx.request({
          url: that.data.roomListUrl,
          data: {
            userId: value.userId,
            deviceId: 123456,
            code: value.code,
            token: value.token,
            offset: 0,
            limit: 1000
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var lList = {};
            for (var o in res.data.data.list) {
              lList[o] = res.data.data.list[o];
              if (res.data.data.list[o].tasks[0]) {
                lList[o].task = res.data.data.list[o].tasks[0];
              } else {
                lList[o].task = {};
              }
              if (res.data.data.list[o].rooms) {
                for (var i in res.data.data.list[o].rooms) {
                  lList[o].rooms[i] = res.data.data.list[o].rooms[i];
                  if (res.data.data.list[o].rooms[i].tasks[0]) {
                    res.data.data.list[o].rooms[i].task = res.data.data.list[o].rooms[i].tasks[0];
                  } else {
                    res.data.data.list[o].rooms[i].task = {}
                  }
                }
              }
            }
            that.setData({
              list: res.data.data.list
            })
          }
        });
      }else{
        wx.redirectTo({
          url: '../login/login'
        })
      }
    },
    open:function(e){
      var that = this;
      var open=true;
      if (that.data.isOpen){
        open = false;
      }else{
        open = true;
      }
      if (that.data.houseId !== e.target.dataset.id){
        open = true;
      }
      that.setData({
        houseId: e.target.dataset.id,
        isOpen: open
      });
    },
    
    openDoor: function (e) {
      var that = this;
      var value = wx.getStorageSync(app.globalData.userInfo);
      var mac = e.target.id;
      var cmd = e.target.dataset.taskcmd;
      var taskstarttime = e.target.dataset.taskstarttime;
      var taskendtime = e.target.dataset.taskendtime;
      if (mac && cmd){
        var date = new Date();
        var now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        if (taskstarttime && taskendtime && taskstarttime < now && taskendtime > now){
          cmd = base64.stringToHex(base64.base64decode(cmd.substr(48, 93)));
          var zKBLockBluetoothService = new bluetoothService.ZKBLockBluetoothService();
          zKBLockBluetoothService.begin(cmd, e.target.id);
        }
        if (taskstarttime > now){
          wx.showToast({
            title: '蓝牙钥匙尚未生效',
            icon: 'success',
            duration: 1000
          })
        }
        if (taskendtime < now){
          wx.showToast({
            title: '蓝牙钥匙已过期',
            icon: 'success',
            duration: 1000
          })
        }
      }else{
        wx.request({
          url: that.data.cmdUrl,
          data: {
            number: e.target.dataset.id,
            userId: value.userId,
            token: value.token,
            isNowOpen: 1,
            isInner: 1,
            assignUserId: value.userId
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var cmd = base64.stringToHex(base64.base64decode(res.data.data.key.substr(48, 93)));
            var zKBLockBluetoothService = new bluetoothService.ZKBLockBluetoothService();
            zKBLockBluetoothService.begin(cmd, e.target.id);
          },
          fail:function(){
            wx.hideLoading();
          }
        });
      }
    },
    loginOut:function(e){
      wx.removeStorageSync(app.globalData.userInfo);
      wx.redirectTo({
        url: '../login/login'
      })
    }
})