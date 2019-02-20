var zkBLockCommBase = require('./ZKBLockCommBase');
var zkBLockCommKLV = require('./../bLockOther/ZKBLockCommKLV');
var zkBCOMMConfig = require('./../bLockOther/ZKBCOMMConfig');
var zkBProtocolTool = require('./../bLockOther/ZKBProtocolTool');

class ZKBLockCommOpen extends zkBLockCommBase.ZKBLockCommBase {
  /**
   * cmd 开门锁命令
   * deviceId 开门唯一标识
   * sessionToken 通讯token
   * */
  constructor(cmd, deviceId, sessionToken) {
    super();
    this.commandId = zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_OPEN;//1byte

    var klvCmd = new zkBLockCommKLV.ZKBLockCommKLV();
    klvCmd.key = '01';
    var deviceIdTemp = zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(deviceId, 16).toUpperCase();
    klvCmd.value = deviceIdTemp;
    this.klv.push(klvCmd);

    var klvCmd2 = new zkBLockCommKLV.ZKBLockCommKLV();
    klvCmd2.key = '02';
    klvCmd2.value = cmd;
    this.klv.push(klvCmd2);

    var klvToken = new zkBLockCommKLV.ZKBLockCommKLV();
    klvToken.key = zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_SESSIONTOKENKEY;
    klvToken.value = sessionToken;
    this.klv.push(klvToken);
  }

}

module.exports = {
  ZKBLockCommOpen: ZKBLockCommOpen
};
