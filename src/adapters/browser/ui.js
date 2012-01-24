if (typeof foounit.ui == 'undefined'){
  foounit.ui = {};
}

(function (ui){
  var _body, _index = 0
    , _autoScrolling = window.location.search.indexOf("foounit.ui.autoScroll=true") > -1
    , _logAll = window.location.search.indexOf("foounit.ui.log=all") > -1;

  var _createTitleNode = function (title, index, className){
    var titleDiv = document.createElement('div');
    titleDiv.className = 'example ' + className;
    titleDiv.innerHTML = '<a name="example' + index + '" ' +
      'class="title">' + title + '</a> ' +
      '&nbsp;<a class="topnav" href="#top">top &raquo;</a>';
    return titleDiv;
  }

  /**
   * Creates a failure node for an example
   */
  var _createFailureNode = function (example, index){
    var titleDiv = _createTitleNode(example.getFullDescription(), index, 'failure');

    var stackDiv = document.createElement('div');
    stackDiv.className = 'stack';
    stackDiv.innerHTML = '<pre>' +
      example.getException().message + "\n\n" +
      example.getStack() +
      '</pre>';
    titleDiv.appendChild(stackDiv);

    return titleDiv;
  };

  /**
   * Creates a success node for an example
   */
  var _createSuccessNode = function (example, index){
    return _createTitleNode(example.getFullDescription(), index, 'success');
  };

  /**
   * Creates a pending node for an example
   */
  var _createPendingNode = function (example, index){
    return _createTitleNode(example.getFullDescription(), index, 'pending');
  };

  /**
   * Progress bar
   */
  var _ProgressBar = function (body){
    this._body = body;

    this._node = document.createElement('div');
    this._node.className = 'progress-bar';
    this._body.appendChild(this._node);

    this._progress = document.createElement('div');
    this._progress.className = 'progress';
    this._node.appendChild(this._progress);

    this._log = document.createElement('div');
    this._log.className = 'progress-bar-log';
    this._node.appendChild(this._log);

    this._appendStatus = function (className, display, index){
      var node = document.createElement('a');
      node.href = '#example' + index;
      node.className = className;
      node.innerHTML = display;
      this._progress.appendChild(node);
    }

    this.fail = function (index){
      this._appendStatus('failure', 'F', index);
    }

    this.success = function (index){
      this._appendStatus('success', '.', index);
    }

    this.pending = function (index){
      this._appendStatus('pending', 'P', index);
    }

    this.log = function (message){
      var node = document.createElement('div');
      node.innerHTML = message;
      this._log.appendChild(node);
    }
  }

  var _Scroller = function (){
    var _listen = function (obj, evt){
    };

    // Runs in the constructor
    _listen(window, 'scroll');
    _listen(window, 'click');

    this.cancel = function (){
    }

    this.bottom = function (){
      if (_autoScrolling){
        window.scroll(0, 1000000);
      }
    }

    this.top = function (){
      if (_autoScrolling){
        window.scroll(0, 0);
      }
    }

  }

  /************ Public functions ***********/

  /**
   * Called to initialize the UI
   */
  ui.init = function (){
    _body = document.getElementsByTagName('body')[0];

    var topNode = document.createElement('a');
    topNode.setAttribute('name', 'top');
    _body.appendChild(topNode);

    _progressBar = new _ProgressBar(_body, 'progress');
    _scroller    = new _Scroller();
  };

  /**
   * Called when an the runner runs an example that fails
   */
  ui.onFailure = function (example){
    try {
      _body.appendChild(_createFailureNode(example, _index));
      _progressBar.fail(_index);
      _scroller.bottom();
      ++_index;
    } catch (e){
      alert('foounit.ui.onFailure: ' + e.message);
    }
  };

  /**
   * Called when the runner runs an example that succeeds
   */
  ui.onSuccess = function (example){
    try {
      if (_logAll){
        _body.appendChild(_createSuccessNode(example, _index));
      }
      _progressBar.success(_index);
      _scroller.bottom();
      ++_index;
    } catch (e){
      alert('foounit.ui.onSuccess: ' + e.message);
    }
  };

  /**
   * Called when the runner runs a pending example
   */
  ui.onPending = function (example){
    try {
      _body.appendChild(_createPendingNode(example, _index));
      _progressBar.pending(_index);
      _scroller.bottom();
      ++_index;
    } catch (e){
      alert('foounit.ui.onPending: ' + e.message);
    }
  }

  /**
   * Called when the suite has finished running
   */
  ui.onFinish = function (info){
    try {
      _progressBar.log('>> foounit summary: '   +
        info.failCount      + ' failed, '  +
        info.passCount      + ' passed, '  +
        info.pending.length + ' pending, ' +
        info.totalCount     + ' total');

      _progressBar.log('>> foounit runtime: ' + info.runMillis + 'ms');
      _scroller.top();
    } catch (e){
      alert('foounit.ui.onFinish: ' + e.message);
    }
  };

})(foounit.ui);

