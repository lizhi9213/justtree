var getSessionToken = require('../zkBLockSdk/bLockCommunication/ZKBLockCommGetSessionToken.js');
var getSessionTokenResponse = require('../zkBLockSdk/bLockCommunication/ZKBLockCommGetSessionTokenResponse.js');
var zkBLockCommOpen = require('../zkBLockSdk/bLockCommunication/ZKBLockCommOpen.js');
var zkBLockCommOpenResponse = require('../zkBLockSdk/bLockCommunication/ZKBLockCommOpenResponse.js');
var zkBLockCommBaseResponse = require('../zkBLockSdk/bLockCommunication/ZKBLockCommBaseResponse.js');
var zkBCOMMResponseErrorCode = require('../zkBLockSdk/bLockOther/ZKBCOMMResponseErrorCode.js');
var zkBCOMMConfig = require('../zkBLockSdk/bLockOther/ZKBCOMMConfig');

var app = getApp();
var bLockServiceUUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
var bLockCharacteristicWriteUUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
var bLockCharacteristicNotifyUUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
var lockPrefix = 'ZK:';

var bluetoothAdapterAvailable = false;
var receiveNotification = "";

class ZKBLockBluetoothService {
  constructor() {
    this.receiveNotification = "";
    this.writeCharacteristicId = bLockCharacteristicWriteUUID;
    this.notifyCharacteristicId = bLockCharacteristicNotifyUUID;
    this.serviceId = bLockServiceUUID;
    this.lockPrefix = lockPrefix;
    this._cmd = "";
    this._mac = "";
  }

  begin(cmd, mac) {
    this._mac = mac;
    this._cmd = cmd;
    console.log(cmd,mac);
    this.closeBluetoothAdapter();
  }

  //初始化蓝牙适配器
  closeBluetoothAdapter() {
    var that = this;
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log("成功关闭蓝牙适配器")
        that.openBluetoothAdapter();
      },
      fail: function (res) {
        console.log(res);
        console.log("关闭蓝牙适配器失败")
        that.openBluetoothAdapter();
      }
    })

  }

  openBluetoothAdapter() {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("初始化蓝牙适配器成功");
        bluetoothAdapterAvailable = true;
        that.onBluetoothDeviceFound();
        that.onBLECharacteristicValueChange();
        that.searchbluetooth();
      },
      fail: function (res) {
        console.log("初始化蓝牙适配器失败")
        wx.showModal({
          title: '提示',
          content: '请检查手机蓝牙是否打开',
          success: function (res) {

          }
        })
      }
    });
  }

  //搜索蓝牙设备
  searchbluetooth() {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log("getBluetoothAdapterState:")
        console.log(res)

        if (res.available && !res.discovering) {
          wx.startBluetoothDevicesDiscovery({
            services: [that.serviceId],
            success: function (res) {
              console.log("-----startBluetoothDevicesDiscovery--success----------");
              console.log(res);
            },
            fail: function (res) {
              console.log('搜索失败');
              console.log(res);
            }
          })
        }
      }
    });



  }

  //监听寻找到新设备的事件
  onBluetoothDeviceFound() {
    var that = this;
    wx.onBluetoothDeviceFound(function (devices) {
      console.log(devices)
      var device = devices.devices[0];
      var deviceName = that.lockPrefix + that._mac;
      //搜索到指定门锁
      console.log(1111111111111)
      console.log(deviceName)
      if (device.name == deviceName) {
        wx.showLoading({
          title: '搜索蓝牙设备中',
        })
        console.log(222222222222222222222)
        that.deviceId = device.deviceId;
        that.createBLEConnection();
        //停止搜索蓝牙设备
        wx.stopBluetoothDevicesDiscovery({
          success: function (res) {
            console.log("停止蓝牙搜索")
            console.log(res)
          }
        })
      }
      console.log('发现新蓝牙设备')
      console.log('设备id' + device.deviceId)
      console.log('设备name' + device.name)
    })
  }

  //连接设备
  createBLEConnection() {
    var that = this;
    wx.createBLEConnection({
      deviceId: that.deviceId,
      success: function (res) {
        // wx.hideLoading()
        /*
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })
        */
        wx.onBLEConnectionStateChange(function (res) {
          // 该方法回调中可以用于处理连接意外断开等异常情况
          wx.hideLoading();
          wx.showToast({
            title: '连接设备失败',
            icon: 'success',
            duration: 1000
          })
          console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
        })

        console.log("连接设备成功")
        console.log(res)
        that.getBLEDeviceServices();
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '连接设备失败',
          icon: 'success',
          duration: 1000
        })
        console.log("连接设备失败")
        console.log(res)
      }
    })
  }

  //获取蓝牙设备所有 service（服务）
  getBLEDeviceServices() {
    var that = this;
    wx.getBLEDeviceServices({
      deviceId: that.deviceId,
      success: function (res) {
        console.log('device services:', res.services);
        that.getBLEDeviceCharacteristics();
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  }

  getBLEDeviceCharacteristics() {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: that.deviceId,
      serviceId: that.serviceId,
      success: function (res) {
        console.log('device getBLEDeviceCharacteristics:', res.characteristics)
        console.log(res)

        that.notifyBLECharacteristicValueChanged();
      },
      fail: function (res) {
        console.log("getBLEDeviceCharacteristics:" + res.errMsg);
      }
    })
  }

  notifyBLECharacteristicValueChanged() {
    var that = this;
    wx.notifyBLECharacteristicValueChanged({
      state: true,
      deviceId: that.deviceId,
      serviceId: that.serviceId,
      characteristicId: that.notifyCharacteristicId,
      success: function (res) {
        console.log('notifyBLECharacteristicValueChanged success', res.errMsg)
        var getSessionTokenCmd = that.getSessionTokenCmd();
        setTimeout(function () {
          that.sendDataSubpackage(that.deviceId, getSessionTokenCmd, 0);
        }, 500);
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  }

  getSessionTokenCmd() {
    var zkBLockCommGetSessionToken = new getSessionToken.ZKBLockCommGetSessionToken();
    var getSessionTokenCmd = zkBLockCommGetSessionToken.getHex();

    console.log("getSessionTokenCmd:" + getSessionTokenCmd);
    return getSessionTokenCmd;
  }

  onBLECharacteristicValueChange() {
    var that = this;
    //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value comed:')
      console.log(characteristic)
      var deviceId = characteristic.deviceId;
      let buffer = characteristic.value
      let dataView = new DataView(buffer)
      var buffLen = dataView.byteLength;
      for (var i = 0; i < buffLen; i++) {
        var getPerData = dataView.getUint8(i).toString(16);
        getPerData = getPerData.length > 1 ? getPerData : '0' + getPerData;
        receiveNotification = receiveNotification + getPerData;
      }

      var zkBLockCommBaseResponseObj = new zkBLockCommBaseResponse.ZKBLockCommBaseResponse(receiveNotification);
      console.log("接收字节长度:" + buffLen + "   " + receiveNotification)
      console.log("协议解析返回状态:" + zkBLockCommBaseResponseObj.errorCode);
      if (zkBLockCommBaseResponseObj.errorCode == zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.PARSE_SUCCESS) {
        //getSessionToken
        if (zkBLockCommBaseResponseObj.commandId == zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_GETSESSIONTOKEN) {
          var zkBLockCommGetSessionTokenResponse = new getSessionTokenResponse.ZKBLockCommGetSessionTokenResponse(zkBLockCommBaseResponseObj);
          var sessionToken = zkBLockCommGetSessionTokenResponse.getToken();
          console.log("开门token:" + sessionToken);
          var zkBLockCommOpenClass = new zkBLockCommOpen.ZKBLockCommOpen(that._cmd, '555', sessionToken);
          var zkBLockCommOpenCmd = zkBLockCommOpenClass.getHex();
          console.log("开门指令:" + zkBLockCommOpenCmd);
          that.sendDataSubpackage(that.deviceId, zkBLockCommOpenCmd, 0);
          //开门指令返回
        } else if (zkBLockCommBaseResponseObj.commandId == zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_OPEN) {
          var zkBLockCommOpenResponseObj = new zkBLockCommOpenResponse.ZKBLockCommOpenResponse(zkBLockCommBaseResponseObj);
          console.log("开门结果:" + zkBLockCommOpenResponseObj.getResultCode());
          if (zkBLockCommOpenResponseObj.getResultCode() == zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.PARSE_SUCCESS) {
            console.log('开门成功')
            wx.hideLoading();
            wx.showToast({
              title: '开门成功',
              icon: 'success',
              duration: 1000
            })
          }else{
            wx.hideLoading();
          }
        }

        that.clearReceiveNotification();
        console.log("deviceId:" + that.deviceId + "serviceId:" + that.serviceId + "notifyCharacteristicId:" + that.notifyCharacteristicId);
      }
    });


  }

  sendDataSubpackage(deviceId, cmd, index) {
    var that = this;
    if (index == 0) {
      that.clearReceiveNotification();
    }
    console.log("index:" + index + "    receiveNotification:" + receiveNotification)
    var subpackageLen = 20 * 2;
    var position = index + subpackageLen;
    let sendDataTemp = cmd.slice(index, position);

    let buffer = that.hex2ArrayBuffer(sendDataTemp);
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: that.serviceId,
      characteristicId: that.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success: function (res) {
        console.log(res)
        console.log('writeBLECharacteristicValue success', res.errMsg);

        console.log("position:" + position + "|cmd:" + cmd);
        console.log("writeCmd:" + sendDataTemp);
        if (position < cmd.length) {
          that.sendDataSubpackage(deviceId, cmd, position);
        }
      },
      fail: function (res) {
        console.log("写入失败");
        console.log(res);
      }
    });
  }

  hex2ArrayBuffer(hexStr) {
    var length = hexStr.length / 2;
    let buffer = new ArrayBuffer(length);
    let dataView = new DataView(buffer);
    var system = 16;
    var hexStrArr = hexStr.split("");
    for (var i = 0; i < length; i++) {
      var perByte = hexStrArr[i * 2] + hexStrArr[i * 2 + 1];
      dataView.setUint8(i, parseInt(perByte, system));
    }

    return buffer;
  }

  getCommandId() {

  }

  clearReceiveNotification() {
    receiveNotification = "";
  }

}

module.exports = {
  ZKBLockBluetoothService: ZKBLockBluetoothService
};