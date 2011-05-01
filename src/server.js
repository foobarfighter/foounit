module.exports.loader = function (root, mounts, options){
  return function (req, res, next){
    next();
    var contents = req.path;
    res.end();
  };
};

module.exports.status = function (root, options){
  options = options || {};
  options.root = root;

  return function (req, res, next){
    res.end('foounit status: ' + new Date().getTime());
  };
};
