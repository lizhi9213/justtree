var zkBLockCommBase = require('./ZKBLockCommBase');
var zkBCOMMConfig = require('./../bLockOther/ZKBCOMMConfig');

class ZKBLockCommGetSessionToken extends zkBLockCommBase.ZKBLockCommBase {
  constructor() {
    super();
    this.commandId = zkBCOMMConfig.ZKBCOMMConfig.ZKBCOMM_GETSESSIONTOKEN;//1byte
  }

}

module.exports = {
  ZKBLockCommGetSessionToken: ZKBLockCommGetSessionToken
};
