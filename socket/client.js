const net = require('net');
const md5 = require('js-md5');

const secretKey = 'I5oCbrolpr'

const getLen = str => { 
  var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/; 
  if (regEx.test(str)) { 
   return str.length * 2; 
  } else { 
   var oMatches = str.match(/[\x00-\xff]/g); 
   var oLength = str.length * 2 - oMatches.length; 
   return oLength; 
  } 
}

const prefixZero = (num, n) => {
  return (Array(n).join(0) + num).slice(-n);
}

const buildMsg = str => {
  try {
    const key = md5(str + secretKey).slice(5, 13)
    const byteLen = prefixZero(getLen(str += key), 4)
    return Buffer.from(byteLen + str)
  } catch (err) {
    console.error(err)
    return false
  }
}

const client = net.createConnection({ port: 8821, host: '127.0.0.1' }, function () {
  const body = buildMsg('2004123456789012345612345678901234567890123456789000')
  client.write(body)
});
client.on('data', function (data) {
    console.log(data.toString())
    client.end()
});
client.on('end', function () {
    console.log('disconnect from server')
});