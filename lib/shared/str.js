var str = module.exports;

str.trim = function (s){
  s = s.replace(/^\s*/, '');
  s = s.replace(/\s*$/, '');
  return s;
}
