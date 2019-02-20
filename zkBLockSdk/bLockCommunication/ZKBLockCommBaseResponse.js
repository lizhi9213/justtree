var zkBLockCommKLV = require('./../bLockOther/ZKBLockCommKLV');
var zkBCOMMConfig = require('./../bLockOther/ZKBCOMMConfig');
var zkBCOMMResponseErrorCode = require('./../bLockOther/ZKBCOMMResponseErrorCode');
var zkBProtocolTool = require('./../bLockOther/ZKBProtocolTool');
 
/*L1协议头*/
var headerMarkResPri = '00';//L1包头
var versionResPri = 0;//4bits
var reserveResPri = 0;//2bits
var ackFlagResPri = 0;//1bit
var errFlagResPri = 0;//1bit
var payloadLengthResPri = 0;//2byte
var CRC16ResPri = 0;//2byte 保留
var sequIdResPri = 0;//2byte 通讯流水号，发起方改变，响应方原值返回

/*L2*/
var versionCmdResPri = 0;//4bits
var reserveL2ResPri = 0;//4bits
var reserveL22ResPri = 0;//1byte


class ZKBLockCommBaseResponse {
  constructor(dataReceived) {
    //super();
    this.errorCode = zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.PARSE_SUCCESS;
    if (dataReceived && dataReceived.length > 24) {
      dataReceived = dataReceived.toUpperCase();
      headerMarkResPri = dataReceived.substr(0, 2);
      if (headerMarkResPri == zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_HEADMARK) {
        var versionResPriTemp = dataReceived.substr(2, 1);
        versionResPri = parseInt(versionResPriTemp, 16);

        var reserve_ackFlag_errFlag_Temp = dataReceived.substr(3, 1);
        var reserve_ackFlag_errFlag_Int = parseInt(reserve_ackFlag_errFlag_Temp, 16);
        reserveResPri = (reserve_ackFlag_errFlag_Int & 12) >> 2;
        ackFlagResPri = (reserve_ackFlag_errFlag_Int & 2) >> 1;
        errFlagResPri = reserve_ackFlag_errFlag_Int & 1;

        var payloadLengthResPriTemp = zkBProtocolTool.ZKBProtocolTool.toNormalByteOrder(dataReceived.substr(4, 4));
        payloadLengthResPri = parseInt(payloadLengthResPriTemp, 16);

        var CRC16ResPriTemp = zkBProtocolTool.ZKBProtocolTool.toNormalByteOrder(dataReceived.substr(8, 4));
        CRC16ResPri = parseInt(CRC16ResPriTemp, 16);

        var sequIdResPriTemp = zkBProtocolTool.ZKBProtocolTool.toNormalByteOrder(dataReceived.substr(12, 4));
        sequIdResPri = parseInt(sequIdResPriTemp, 16);

        /******L2********/
        this.commandId = dataReceived.substr(16, 2);

        var versionCmdResPriTemp = dataReceived.substr(18, 1);
        versionCmdResPri = parseInt(versionCmdResPriTemp, 16);

        var reserveL2ResPriTemp = dataReceived.substr(19, 1);
        reserveL2ResPri = parseInt(reserveL2ResPriTemp, 16);

        var reserveL22ResPriTemp = zkBProtocolTool.ZKBProtocolTool.toNormalByteOrder(dataReceived.substr(20, 4));
        reserveL22ResPri = parseInt(reserveL22ResPriTemp, 16);

        /*******klv*******/
        this.klvs = new Array();

        var sign = true;
        var dataReceivedLength = dataReceived.length;
        var klvData = dataReceived.substr(24, dataReceivedLength - 24);
        if (klvData && klvData.length > 0) {
          sign = true;
        }else {
          sign = false;
        }

        while(sign){
          if (klvData && klvData.length >= 6) { /*key 1个字节， length 2个字节，最短6位*/
            var keyTemp = klvData.substr(0, 2);
            var lengthTemp = zkBProtocolTool.ZKBProtocolTool.toNormalByteOrder(klvData.substr(2, 4));
            var lengthTempInt = parseInt(lengthTemp, 16) * 2;
            if (lengthTempInt <= (klvData.length - 6)) {
              var valueTemp = klvData.substr(6, lengthTempInt);

              var klv = new zkBLockCommKLV.ZKBLockCommKLV();
              klv.key = keyTemp;
              klv.value = valueTemp;
              this.klvs.push(klv);
              var startIndex = 6 + lengthTempInt;
              var lengthSurplus = klvData.length - startIndex;
              if (lengthSurplus == 0)
              {
                sign = false;
              }
              klvData = klvData.substr(startIndex, lengthSurplus);
            }else{
              this.errorCode = zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.UNABLE_PARSE_KLV;
              sign = false;
            }
          }else{
            this.errorCode = zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.UNABLE_PARSE_KLV;
            sign = false;
          }
        }

      }else {
        this.errorCode = zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.L1HEADMARK_IS_WRONG;
      }
    }else {
      this.errorCode = zkBCOMMResponseErrorCode.ZKBCOMMResponseErrorCode.LENGTH_IS_NOT_ENOUGH;
    }
    
  }

  get errorCode() {
    return this._errorCode.toUpperCase();
  }

  set errorCode(errorCode) {
    this._errorCode = errorCode;
  }


  get klvs() {
    return this._klvs;
  }

  set klvs(klvs) {
    this._klvs = klvs;
  }
  

  get commandId() {
    return this._commandId;
  }

  set commandId(commandId) {
    this._commandId = commandId;
  }

}

module.exports = {
  ZKBLockCommBaseResponse: ZKBLockCommBaseResponse
};
