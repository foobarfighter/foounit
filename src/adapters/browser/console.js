// TODO: Beef this up for crappy browsers
(function (){
  if (typeof console === 'undefined'){ console = {}; }

  var funcs = ['log', 'dir', 'info', 'debug', 'error'];
  for (var i = 0; i < funcs.length; ++i){
    var func = funcs[i];
    if (!console[func]){
      console[func] = function (){ };
    }
  }
})();
