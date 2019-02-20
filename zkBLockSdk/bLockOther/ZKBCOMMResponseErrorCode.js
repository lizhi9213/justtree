let ZKBCOMMResponseErrorCode = {
  PARSE_SUCCESS: '00',                 /*解析成功 */
  LENGTH_IS_NOT_ENOUGH: '01',          /*数据长度不够*/
  L1HEADMARK_IS_WRONG: '02',           /*L1协议头不正确*/
  UNABLE_PARSE_KLV: '03',              /*解析klv结构失败*/
  NO_RESULTCODE: 'F0'                  /*找不到结果码*/
};

module.exports = {
  ZKBCOMMResponseErrorCode: ZKBCOMMResponseErrorCode
};