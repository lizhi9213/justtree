var zkBProtocolTool = require('./ZKBProtocolTool');

 
class ZKBLockCommKLV {
  constructor() {
    this.key = '';
    this.value = '';
  }

  get key() {
    return this._key.toUpperCase();
  }

  set key(key) {
    this._key = key;
  }


  get value() {
    return this._value.toUpperCase();
  }

  set value(value) {
    this._value = value;
  }

  getData() {
    var valueLengthPro = (this.value.length/2).toString(16).toUpperCase();
    valueLengthPro = zkBProtocolTool.ZKBProtocolTool.toSmallByteOrder(valueLengthPro, 2);
    return this.key + valueLengthPro + this.value;
  }
}

module.exports = {
  ZKBLockCommKLV: ZKBLockCommKLV
};
