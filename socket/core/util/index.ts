export * from './bodyParser';
export * from './bodyBuilder';
export * from './dtoBuilder';

export const getAscLength = str => { 
  var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/; 
  if (regEx.test(str)) { 
   return str.length * 2; 
  } else { 
   var oMatches = str.match(/[\x00-\xff]/g); 
   var oLength = str.length * 2 - oMatches.length; 
   return oLength; 
  } 
}

export const prefixZero = (num, n) => {
  return (Array(n).join('0') + num).slice(-n);
}
