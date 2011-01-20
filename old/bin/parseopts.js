/*
  ParseOpts grepped and lightly modified from:
  http://github.com/mde/geddy/raw/master/geddy-core/lib/parseopts.js
*/
var parseopts = new function () {
  this.parse = function (optsReg, args) {
    var cmds = [];
    var opts = {};
    var optsReverseMap = {};
    var optsItem;
    var arg;
    var argName;
    var argItems;

    for (var p in optsReg) {
      optsItem = optsReg[p];
      for (var i = 0; i < optsItem.length; i++) {
        optsReverseMap[optsItem[i]] = p;
      }
    }

    while (args.length) {
      arg = args.shift();
      if (arg.indexOf('--') == 0) {
        argItems = arg.split('=');
        argName = optsReverseMap[argItems[0]];
        if (argName) {
          opts[argName] = argItems[1] || null;
        } else {
          throw new Error('Unknown option "' + argItems[0] + '"');
        }
      } else if (arg.indexOf('-') == 0) {
        argName = optsReverseMap[arg];
        if (argName) {
          opts[argName] = (!args[0] || (args[0].indexOf('-') == 0)) ?
            null : args.shift();
        } else {
          throw new Error('Unknown option "' + arg + '"');
        }
      } else {
        cmds.push(arg);
      }
    }

    return {cmds: cmds, opts: opts};
  };
};
/* end of parseopts */

module.exports = parseopts
