if (typeof foounit.ui == 'undefined'){
  foounit.ui = {};
}

(function (ui){
  var _body;

  /**
   * Creates a failure node for an example
   */
  var _createFailureNode = function (example){
    var titleDiv = document.createElement('div');
    titleDiv.className = 'example failure';
    titleDiv.innerHTML = '<div class="title">' + example.getDescription() + '</div>';

    var stackDiv = document.createElement('div');
    stackDiv.className = 'stack';
    stackDiv.innerHTML = '<pre>' + example.getStack() + '</pre>';
    titleDiv.appendChild(stackDiv);

    return titleDiv;
  };

  /**
   * Creates a success node for an example
   */
  var _createSuccessNode = function (example){
    var titleDiv = document.createElement('div');
    titleDiv.className = 'example success';
    titleDiv.innerHTML = '<div class="title">' + example.getDescription() + '</div>';
    return titleDiv;
  };

  /**
   * Creates a pending node for an example
   */
  var _createPendingNode = function (description){
    var titleDiv = document.createElement('div');
    titleDiv.className = 'example pending';
    titleDiv.innerHTML = '<div class="title">' + description + '</div>';
    return titleDiv;
  };

  /**
   * Progress bar
   */
  var _ProgressBar = function (body){
    this._body = body;

    this._node = document.createElement('div');
    this._node.className = 'progress-bar';
    this._body.appendChild(this._node);

    this.fail = function (){
      var node = document.createElement('span');
      node.className = 'failure';
      node.innerHTML = 'F';
      this._node.appendChild(node);
    }

    this.success = function (){
      var node = document.createElement('span');
      node.className = 'success';
      node.innerHTML = '.';
      this._node.appendChild(node);
    }

    this.pending = function (){
      var node = document.createElement('span');
      node.className = 'pending';
      node.innerHTML = 'P';
      this._node.appendChild(node);
    }
  }

  /************ Public functions ***********/

  /**
   * Called to initialize the UI
   */
  ui.init = function (){
    _body = document.getElementsByTagName('body')[0];
    _progressBar = new _ProgressBar(_body, 'progress');
  };

  /**
   * Called when an the runner runs an example that fails
   */
  ui.onFailure = function (example){
    try {
      _body.appendChild(_createFailureNode(example));
      _progressBar.fail();
    } catch (e){
      alert('foounit.ui.onFailure: ' + e.message);
    }
  };

  /**
   * Called when the runner runs an example that succeeds
   */
  ui.onSuccess = function (example){
    try {
      _body.appendChild(_createSuccessNode(example));
      _progressBar.success();
    } catch (e){
      alert('foounit.ui.onSuccess: ' + e.message);
    }
  };

  /**
   * Called when the runner runs a pending example
   */
  ui.onPending = function (example){
    _progressBar.pending();
  }

  /**
   * Called when the suite has finished running
   */
  ui.onFinish = function (info){
    try {
      var pending = info.pending;
      for (var i = 0; i < pending.length; ++i){
        _body.appendChild(_createPendingNode(pending[i]));
      }
      console.log('>> foounit summary: '   +
        info.failCount      + ' failed, '  +
        info.passCount      + ' passed, '  +
        info.pending.length + ' pending, ' +
        info.totalCount     + ' total');
      console.log('>> foounit runtime: ', info.runMillis + 'ms');
    } catch (e){
      alert('foounit.ui.onFinish: ' + e.message);
    }
  };

})(foounit.ui);

