var typePri = parseInt('FF', 16);
var tokenPri = '';
var tokenSecPri = parseInt('FFFF', 16);

class ZKBLockCommGetSessionTokenResponse {
  constructor(zkBLockCommBaseResponse) {
    this.klvs = zkBLockCommBaseResponse.klvs;
    if (this.klvs && this.klvs.length > 0) {
      for (var i = 0; i < this.klvs.length; i++) {
        if (this.klvs[i].key == '01') {
          var temp = this.klvs[i].value;
          typePri = parseInt(temp, 16);
          continue;
        }

        if (this.klvs[i].key == '02') {
          var temp = this.klvs[i].value;
          tokenPri = temp;
          continue;
        }

        if (this.klvs[i].key == '03') {
          var temp = this.klvs[i].value;
          tokenSecPri = parseInt(temp, 16);
        }

      }
    }

  }

  getType() { /*安全保证方式*/
  	return typePri;
  }

  getToken() { /*通讯token*/
  	return tokenPri;
  }

  getTokenSec() { /*通讯token有效期，秒数*/
  	return tokenSecPri;
  }

}

module.exports = {
  ZKBLockCommGetSessionTokenResponse: ZKBLockCommGetSessionTokenResponse
};
