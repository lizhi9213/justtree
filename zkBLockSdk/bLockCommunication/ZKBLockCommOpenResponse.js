var resultCodePri = parseInt('FF', 16);
var surplusOpenTimesPri = parseInt('FF', 16);

class ZKBLockCommOpenResponse {
  constructor(zkBLockCommBaseResponse) {
    this.klvs = zkBLockCommBaseResponse.klvs;

    if (this.klvs && this.klvs.length > 0) {
        for (var i = 0; i < this.klvs.length; i++) {
            if (this.klvs[i].key == '03') {
                var temp = this.klvs[i].value;
                resultCodePri = parseInt(temp, 16);
                continue;
            }

            if (this.klvs[i].key == '04') {
                var temp = this.klvs[i].value;
                surplusOpenTimesPri = parseInt(temp, 16);
                continue;
            }

        }
    }

  }

  getResultCode() {/*结果码*/
    return resultCodePri;
  }

  getSurplusOpenTimes() {/*剩余开门次数*/
    return surplusOpenTimesPri;
  }

}

module.exports = {
  ZKBLockCommOpenResponse: ZKBLockCommOpenResponse
};
