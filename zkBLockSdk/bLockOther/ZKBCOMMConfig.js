let ZKBCOMMConfig = {
  ZKBCOMM_HEADMARK: 'AB',            /*锁通讯协议头固定值*/
  ZKBCOMM_GETSESSIONTOKEN: '01',     /*获取Session Token*/
  ZKBCOMM_SESSIONTOKENKEY: 'F0',     /*sessionToken key*/
  ZKBCOMM_GETBLEMAC: '02',           /*获取BLE MAC*/
  ZKBCOMM_GETSTATUS: '04',           /*获取锁状态*/
  ZKBCOMM_OPEN: '03',                /*电子钥匙开锁*/
};

module.exports = {
  ZKBCOMMConfig: ZKBCOMMConfig
};