var zkBProtocolTool = require('./../bLockOther/ZKBProtocolTool');
var zkBCOMMConfig = require('./../bLockOther/ZKBCOMMConfig');
 
/*L1协议头*/
var versionPri = 0;//4bits
var reservePri = 0;//2bits
var ackFlagPri = 0;//1bit
var errFlagPri = 0;//1bit
var payloadLengthPri = 0;//2byte
var CRC16 = 0;//2byte 保留
var sequId = 0;//2byte 通讯流水号，发起方改变，响应方原值返回

/*L2*/
var versionCmdPri = 0;//4bits
var reserveL2Pri = 0;//4bits
var reserveL22Pri = 0;//1byte


class ZKBLockCommBase {
  constructor() {
    //super();
    this.commandId = '00';//1byte
    this.klv = new Array();
    
  }




  /*********KLV***********************************/

  /**
  * 此函数子类需要重写
  */
  getKLVData() {
    var temp = '';
    for (var i = 0; i < this.klv.length; i++) {
      temp = temp + this.klv[i].getData();
    }
    return temp;
  }


  /*********L2**************************************/
  set commandId(commandId) {
    this._commandId = commandId.toUpperCase();
  }

  get commandId() {
    return this._commandId;
  }

  getVersion_Reserve() {
    var total = (versionCmdPri << 4) & 240 + reserveL2Pri & 15;
    var temp = total.toString(16).toUpperCase();
    return zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(temp, 1).toUpperCase();
  }

  getReserve() {
    return zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(reserveL22Pri.toString(), 2).toUpperCase();
  }

  getL2Data() {
    return this.commandId + this.getVersion_Reserve() + this.getReserve();
  }


  /*********L1**************************************/
  getVersion_Reserve_AckFlag_ErrFlag() {
    var total = (versionPri << 4) & 240 + (reservePri << 2) & 12 + (ackFlagPri << 1) & 2 + errFlagPri & 1;
    var temp = total.toString(16).toUpperCase();
    return zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(temp, 1).toUpperCase();
  }

  getPayloadLength() {
    var temp = ((this.getKLVData().length + this.getL2Data().length)/2).toString(16).toUpperCase();
    return zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(temp, 2).toUpperCase();
  }

  getCRC16() {
    var temp = CRC16.toString(16).toUpperCase();
    return zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(temp, 2).toUpperCase();
  }

  getSequId() {
    var temp = sequId.toString(16).toUpperCase();
    return zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(temp, 2).toUpperCase();
  }

  getL1HeaderData() {
    return zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_HEADMARK + this.getVersion_Reserve_AckFlag_ErrFlag() + this.getPayloadLength() + this.getCRC16() + this.getSequId();
  }

  /*获取组装好的协议数据*/
  getHex() {
    var temp = this.getL1HeaderData() + this.getL2Data() + this.getKLVData();
    return temp;
  }


}

module.exports = {
  ZKBLockCommBase: ZKBLockCommBase
};
