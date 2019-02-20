let ZKBProtocolTool = {};

/*变为正常字节序*/
ZKBProtocolTool.toNormalByteOrder = function (message) {
  if (message && message.length % 2 == 0) {
    let length = message.length / 2;
    let messageNew = '';
    for (var i = 0; i < length; i++) {
      messageNew = messageNew + message.substr((length - i - 1) * 2, 2);
    }
    return messageNew;
  } else {
    return '';
  }
}

/**
 * string 需要转换的字符串
 * length 目标字符串的长度（字节）
 * */
ZKBProtocolTool.toSmallByteOrder = function (str, length) {
  if (str) {
    if (str.length < length * 2) {
      let repairLength = length * 2 - str.length;
      let repairString = "";
      for (let i = 0; i < repairLength; i++) {
        repairString = repairString + '0';
      }
      str = repairString + str;
    }

    let stringNew = "";
    let stringLength = str.length;
    for (let j = 1; j <= stringLength / 2; j++) {
      stringNew = stringNew + str.substr((stringLength - j * 2), 2);
    }
    return stringNew;

  } else {
    return '';
  }
}

/** 
 * 仅支持yyyy-MM-dd HH:mm:ss形式字符串
 * 返回两个时间相差的秒数
 */
ZKBProtocolTool.getDiffTimeString = function(time1, time2) {
  var baseTime = time1;  
  var baseTimestamp = Date.parse(new Date(baseTime));  
  baseTimestamp = baseTimestamp / 1000;

  var otherTime = time2;  
  var otherTimestamp = Date.parse(new Date(otherTime));  
  otherTimestamp = otherTimestamp / 1000;

  return (otherTimestamp - baseTimestamp).toString(16).toUpperCase();
}

/**
 * time:yyyy-MM-dd HH:mm:ss
 * 返回秒数
 * */
ZKBProtocolTool.getProtocolTime = function(time) {
  var baseTime = '2010-01-01 00:00:00';
  var baseTimestamp = Date.parse(new Date(baseTime));  
  baseTimestamp = baseTimestamp / 1000;

  var otherTime = time;
  var otherTimestamp = Date.parse(new Date(otherTime));  
  otherTimestamp = otherTimestamp / 1000;

  return (otherTimestamp - baseTimestamp).toString(16).toUpperCase();
}

/**
 * second秒数
 * 返回时间字符串（yyyy-MM-dd HH:mm:ss）
 * */
ZKBProtocolTool.getProtocolSec = function(second) {
  var baseTime = '2010-01-01 00:00:00';
  var baseTimestamp = Date.parse(new Date(baseTime));  
  baseTimestamp = baseTimestamp / 1000;

  var otherTime = second + baseTimestamp;
  var resultDate = new Date(otherTime);
  return resultDate.getFullYear() + '-' + (resultDate.getMonth() + 1) + '-' + resultDate.getDate() + ' ' + resultDate.getHours() + ':' + resultDate.getMinutes() + ':' + resultDate.getSeconds();
}

module.exports = {
  ZKBProtocolTool: ZKBProtocolTool
};
