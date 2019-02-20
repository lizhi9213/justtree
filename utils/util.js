function hex2ArrayBuffer(hexStr) {
  var length = hexStr.length/2;
  let buffer = new ArrayBuffer(length);
  let dataView = new DataView(buffer);
  var system = 16;
  var hexStrArr = hexStr.split("");
  for (var i = 0; i < length; i++) {
    var perByte = hexStrArr[i * 2] + hexStrArr[i * 2 + 1];
    dataView.setUint8(i, parseInt(perByte, system));
  }

  return buffer;
}

module.exports = {
  hex2ArrayBuffer: hex2ArrayBuffer
}

