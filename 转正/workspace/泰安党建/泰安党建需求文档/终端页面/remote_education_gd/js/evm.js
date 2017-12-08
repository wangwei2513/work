/* evm.js -v 0.1.0 -build on 2014-11-09. 
 contact: yangty@evmtv.com */
(function(global, undefined) {
// Avoid conflicting when `evm.js` is loaded multiple times
if (global.evm) {
  return;
}

/*
 *util-base
 */

var doc = document;

function getStbBrowser() {
  var _browser, _stb;
  if(typeof navigator == 'object' && navigator.appName) {
    _browser = navigator.appName || 'unknown';
    switch(_browser) {
    case 'Microsoft Internet Explorer':
    case 'Netscape':
    case 'Opera':
      _browser = 'pc';
      _stb = false;
      break;
    case 'EnRich':
      _stb = 'Enrich';
      break;
    case 'EIS iPanel':
      _stb = 'iPanel';
      break;
    case 'unknown':
      _stb = browser;
      break;
    }
  }
  return {
   stb: _stb,
   browser: _browser
  };
}

function isType(type) {
  return function(obj) {
    return typeof obj == type;
  };
}

var isObject = isType('object');
var isFunction = isType('function');
var isString = isType('string');
var isBoolean = isType('boolean');
var isNumber = isType('number');

function trim(s){
  return s.replace(/^\s*|\s$/g, '');
}

function extend(o) {
  var args = [], i = 1;
  if(arguments.length == 1) {
    args[i] = o;
    o = this;
  }else{
    args = arguments;
    o = arguments[0];
  }
  for(i; i < args.length; i++) {
    for(var m in args[i]) {
      o[m] = args[i][m];
    }
  }
  return o;
}

function inherit(p) {
  if(p === null) throw TypeError();
  if(Object.create) return Object.create(p);
  if (!isObject(p) && !isFunction(p)) throw TypeError();
  function f(){};
  f.prototype = p;
  return new f;
}

function merge(o, p) {
  for(var m in p) {
    if(!(o[m])) o[m] = p[m];
  }
}

function restrict(o,p) {
  for(var m in o) {
    if(!(p[m])) delete o[m];
  }
  return o;
}

function subtract(o,p) {
  for(var m in o) {
    if(p[m]) delete o[m];
  }
  return o;
}

function union(o,p) {
  return extend(extend({},o),p);
}

function intersection(o,p) {
  return restrict(extend({},o),p);
}

function throttle(fn, context) {
  clearTimeout(fn.tId);
  fn.tId = setTimeout(function(){
    fn.call(context);
  }, 100);
}

function chunk(array, process, context) {
  function fn() {
    process.call(context, array.shift());
    if(array.length > 0) setTimeout(fn, 100)
  }
  fn();
}

/*
 *shim
 */
var forEach = function() {
  if(![].forEach) {
    return function(items, fn) {
     if(isString(items)) {
       items = items.split(' ');
     }
     for(var i = 0, len = items.length; i < len; i++) {
       fn(items[i], i);
     }
   };
  }
}();

var hasJSON = global.JSON;



/*
 *util-pub
 */
var publisher = {
  subscribers: {any: []},
  on: function(type, fn, context) {
    var p = this;
    type = type || 'any';
    fn = isFunction(fn) ? fn : context[fn];
    p.subscribers[type] = p.subscribers[type] || [];
    p.subscribers[type].push({fn: fn, context: context});
  },
  off: function(type, fn, context) {
    this.visit('unsubscribe', type, fn, context);
  },
  emit: function(type, publication) {
    this.visit('publish', type, publication);
  },
  visit: function(action, type, args, context) {
    var pubtype = type || 'any',
      subscribes = this.subscribes[pubtype],
      max = subscribes ? subscribes.length : 0;
    
    for(var i = 0; i < max; i++) {
      if(action === 'publish') {
        subscribes[i].fn.call(subscribes[i].context, args);
      }else{
        if(subscribes[i].fn === args &&
          subscribes[i].context === context) {
            subscribes.splice(i,1);
          }
      }
    }
  }
};

function makePublisher(o) {
  for(var m in publisher) {
    if(isFunction(publisher[m])) {
      o[m] = publisher[m];
    }
  }
  o.subscribes = {any: []};
}

/*
 *util-event
 */
var on = function(target, type, handler, context) {
  target['on'+type] = function(e) {
    handler.call(context, e, this);
  };
};
var off = function(target, type) {
    target['on'+type] = null;
};
var one = function(target, type, handler, context) {
  on(target, type, function(e, target){
    handler.call(this,e, target);
    off(target, type);
  }, context);
};
/*
 *util-ajax
 */
var ajax = function() {
  var xhrId = 0,
    xhr = null,
    create = function() {
      if(XMLHttpRequest) {
          return function() {
            return new XMLHttpRequest();
          };
      }else{
        return function() {
            new ActiveXObject('Msxml2.XMLHTTP');
        };
      }
    }(),
    Ajax = function(url, data, callback, abort, timeout, context) {
      var args = [],
        argsLen = arguments.length,
        xhr = null,
        evt = Ajax.evt;
      
      if(argsLen === 0) throw new Error('Not found parameters when invoking ajax');
      if(argsLen === 1) {
        //No1 situation：argument is an object like {url:'', data:'', callback:fn, abort:fn, timeout:fn} 
        args = arguments[0];
        if(typeof args == 'object') {
          if(!args.url)
            throw new Error('url is undefined');
          url = args.url;
          if(!args.callback)
            throw new Error('callback is undefined');
          callback = args.callback;
          data = args.data || null;
          abort = args.abort;
          timeout = args.timeout;
          context = args.context;
        }
      }else{
        //No2：many arguments
        if(context === undefined) {
          if(typeof timeout == 'object') {
            context = timeout;
          }else if(typeof abort == 'object') {
            context = abort;
          }else if(typeof callback == 'object') {
            context = callback;
          }
        }
        if(callback === undefined || callback) {
          callback = data;
          data = null;
        }
        if(!isFunction(callback))
          throw new TypeError();
        if(!isString(url))
          throw new TypeError();
      }
      xhr = create();
      xhr.guid = xhrId++; 
      xhr.open('get', url, true); 
      xhr.onreadystatechange =  function() {
        if (xhr.readyState === 4 && 
          (xhr.status == 200 || (xhr.status > 300 || xhr.status <= 304))) {
          callback.call(context || xhr, checkContent(xhr));
        }
      };
      xhr.onabort = function() {
        (abort ? abort: callback)('ABORT');
      };
      xhr.ontimeout = function() {
        (timeout ? timeout : callback)('TIMEOUT');
      };
      
      evt.push({guid: xhr.guid, xhr: xhr});
      xhr.send(data);
      return xhr;
     };
    
    function checkContent(r) {
      var contentType = r.getResponseHeader("Content-Type");
      if (!contentType) return r.responseText;

      if(contentType.indexOf("json") !== -1 ) {
        return eval( 'false||' + r.responseText);
      }
      
      if(contentType.indexOf("text/html") !== -1) {
        try{
          return eval( 'false||' + r.responseText);
        }catch(e){
          return r.responseText;
        }
      }
      
      if(contentType.indexOf("xml") !== -1 ) {
        return r.responseXML;
      }
      return r.responseText;
    }
    
    Ajax.evt = [];
  return Ajax;
}();

/*
 *util-dom
 */
function viaID(id) {
  if(doc.getElementById)
    return doc.getElementById(id);
  else
    return document.all(id);
}

function viaTagName(name, root) {
  root = root || doc;
  if(root.getElementsByTagName)
    return root.getElementsByTagName(name);
}

/*
 * shim method: 茁壮中间件不支持getElementsByClassName
 */
function viaClassName(searchClass, node, tag){
  node = node || doc;
  var nodes = node.getElementsByTagName(tag);
  var arrReturnElements = [];
  searchClass = searchClass.replace(/\-/g, '\\-');
  var pat = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
  for(var i=0; i < nodes.length; i++){
      node = nodes[i];
      if(pat.test(node.className)){
        arrReturnElements.push(node);
      }
      
  }
  return arrReturnElements;
}

function getStyle(elem, prop) {
  if(elem.style[prop]) {
    return elem.style[prop];
  }else if(document.defaultView.getComputedStyle) {
    prop = prop.replace(/([A-Z])/g,"-$1");
    prop = prop.toLowerCase();
    return document.defaultView.getComputedStyle(elem, null)[prop];
  }else{
    return elem.currentStyle[prop];
  }   
}

function css(elem, value){
  if(isString(value)) {
    elem.style.cssText = (elem.style.cssText + (elem.style.cssText.match(/\;$/) ? '':';') + value);
  }else if(isObject(value)){
    for(var m in value) elem.style[m] = value[m];
  }
}


function html(elem, value) {
  if(elem && value){
    elem.innerHTML = value;
  }
}

function text(elem, value) {
  if(elem && value) {
    if(elem.innerText)
      elem.innerText = value;
    else if(elem.textContent)
      elem.textContent = value;
  }
}


/*
 *evm is a function.
 */
var evm = global.evm = function EVM(selector, root, tag) {
  if(!this === global) return EVM(selector, root, tag);
  
  if(!isString(selector)) return evm;
  
  if(!root && !tag) {
    if(selector in cache) {
      evm.data = cache[selector];
      return evm.data;
    }
  }
  
  
  switch(selector.charAt(0)) {
  case '#':
    cache[selector] = evm.data = viaID(selector.substr(1));
    break;
  case '.':
    if(!root && !tag) {
      cache[selector] = evm.data = viaClassName(selector.substr(1), doc, '*');
    }else{
      evm.data = viaClassName(selector.substr(1), root||doc, tag||'*');
    }
    
    break;
  default:
    if(!root) {
      cache[selector] = evm.data = viaTagName(selector, doc);
    }else{
      evm.data = viaTagName(selector, root);
    }
  }
  
  
 
  return evm.data;
};
evm.data = null;
var cache = evm.cache = {};
/*
 *util-cls
 */
var hasClass, addClass, removeClass, toggleClass;

var hasClassList = function(){
  return !!doc.documentElement.classList || false;
}();

if(!hasClassList) {
  hasClass = function(elem, clsName) {
    return new RegExp('(^|\\s)' + clsName + '(\\s|$)').test(elem.className);
  };
  addClass = function(elem, clsName) {
    if(!hasClass(elem, clsName))
      elem.className += (elem.className ? ' ' : '') + clsName;
  };
  removeClass = function(elem, clsName) {
    if (hasClass(elem, clsName))
        elem.className = elem.className.replace(new RegExp('(^|\\s)*' + clsName + '(\\s|$)*', 'g'), '');
  };
  toggleClass = function(elem, clsName) {
    (hasClass(elem, clsName) ? removeClass : addClass)(elem, clsName);
  };
}else{
  hasClass = function(elem, clsName) {
    return elem.classList.contains(clsName);
  };
  addClass = function(elem, clsName) {
    elem.classList.add(clsName);
  };
  removeClass = function(elem, clsName) {
    elem.classList.remove(clsName);
  };
  toggleClass = function(elem, clsName) {
    elem.classList.toggle(clsName);
  };
}

/*
 * util-cookie
 */

var cookie;
var cutCookie;
(function() {
  var pluses = /\+/g;
  
  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // If can't decode the cookie, ignore it
      // If can't parse the cookie, ignore it
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch(e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return isFunction(converter) ? converter(value) : value;
  }
  
  var config = cookie = function (key, value, options) {
  // Write
  if(value !== undefined && !isFunction(value)) {
    options = extend({}, config.defaults, options);
    
    if (typeof options.expires == 'number') {
     var days = options.expires,
       t = options.expires = new Date();
     t.setTime(+t + days * 864e+5);
    }
 
    return (document.cookie = [
     encode(key), '=', stringifyCookieValue(value),
     options.expires ? '; expires=' + options.expires.toUTCString() : ''
     //,
     // use expires attribute, max-age is not supported by IE
     //options.path    ? '; path=' + options.path : '',
     //options.domain  ? '; domain=' + options.domain : '',
     //options.secure  ? '; secure' : ''
    ].join(''));
  }

  // Read
  var result = key ? undefined : {};

  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all. Also prevents odd result when
  // calling cookie().
  var cookies = document.cookie ? document.cookie.split('; ') : [];
  
  for (var i = 0, l = cookies.length; i < l; i++) {
    var parts = cookies[i].split('=');
    var name = decode(parts.shift());
    var cookie = parts.join('=');
    if (key && key === name) {
     //if second parameter is a function it's a converter...
     result = read(cookie, value);
     break;
    }
 
    // Prevent storing a cookie that couldn't decode.
    if (!key && (cookie = read(cookie)) !== undefined) {
     result[name] = cookie;
    }
  }

  return result;
  };

  config.defaults = {
    raw: false,
    json: false,
  };

  cutCookie = function (key, options) {
    if (cookie(key) === undefined) {
     return false;
    }
    cookie(key, '', extend({}, { expires: -1 }));
    return !cookie(key);
  };
  return cookie;
})();


/*
 *util-controller
 */
function controller(evt) {
  evt = evt || window.event;
  var key = evt.which || evt.keyCode,
    items = controller.items,
    types = controller.types,
    type,
    target,
    result,
    i = 0;
  
  //reset isBlock to default value
  var isBlock = controller.isBlock = 0;
  do{
    type = types[i];
    
    if((type == 'dialog-box') && (items[type] && items[type].length > 0)) {
       target = items[type][items[type].length - 1];
       target.fn.call(target.context, key);
       return controller.halt(1, evt);
    }
    
    if((type == 'viewport') && (items[type] && items[type].length > 0)) {
      target = items[type][items[type].length - 1];
      result = target.fn.call(target.context, key);
      return controller.halt(result === 1 ? result : isBlock, evt);
    }
  }while(++i < types.length);
  
  return controller.halt(evt);
}

controller.halt = function(v,e) {
  if(v && e) {
    this.isBlock = v
  }else{
    e = v;
  }
  if(this.isBlock) {
    if(e.preventDefault) e.preventDefault();
    return 0;
  }
  return 1;
}

controller.isBlock = 0;
controller.types = ['dialog-box', 'viewport'];
controller.items = {};

//pub-sub mode
controller.subscribe = function(item) {
  if(item === null || item === undefined) throw typeError();
  if(typeof item != 'object') throw typeError();
  
  var self = this,
    i = 0,
    target,
    type,
    callback,
    context,
    method;
  
  if(item.context === undefined) 
    throw new Error('+_= Not fount *context* property');
  if(item.callback === undefined) 
    throw new Error('+_= Not fount *callback* property');
  if(item.method === undefined) 
    throw new Error('+_= Not fount *method* property');
    
  context = item.context;
  callback = item.callback;
  method = item.method;
  //check up the type of callback
  callback = (typeof callback == 'string') ?
    context[callback] : callback;
  //check up the controllerType property is attached in the context
  if(context.controllerType === undefined) {
    //check up the type property is attached in the item
    if(item.type !== undefined) {
      context.controllerType = +item.type;
    }else{
      throw new Error('+_= Not fount *type* property');
    }
  }
  
  if(self.types[context.controllerType] === undefined)
    return self;
  
  type = self.types[context.controllerType];
  
  if(method == 'add') {
    self.items[type] = self.items[type] || [];
    self.items[type].push({fn: callback, context: context});
  }else if(method == 'remove') {
    do{
      target = self.items[type][i];
      if(target.fn === callback && target.context === context){
        self.items[type].splice(i, 1); 
        break;
      }
    }while(self.items[type][++i]);
  }
  
  return self;
};


/**
 * config.js - The configuration for the library
 */

evm.version = '0.1.0';
// The charset for requesting files
evm.charset = "utf-8";

// Public API:

evm.hasClass = function(elem, clsName) {
  return hasClass(elem, clsName);
};

evm.addClass = function(elem, classes) {
  if(isString(classes)){
    addClass(elem, classes);
  }else{
    forEach ? forEach(classes, function(cls) { addClass(elem, cls); }) :
      classes.forEach(function(cls) { addClass(elem, cls); });
  }
};

evm.removeClass = function(elem, classes) {
  if(isString(classes)) {
    removeClass(elem, classes);
  }else{
    forEach ? forEach(classes, function(cls) { removeClass(elem, cls); }) :
      classes.forEach(function(cls) { removeClass(elem, cls); });
  }
};

evm.toggleClass = function(elem, classes) {
  if(isString(classes)) {
    toggleClass(elem, classes);
  }else{
    forEach ? forEach(classes, function(cls) { toggleClass(elem, cls); }) :
      classes.forEach(function(cls){ toggleClass(elem, cls); })
  }
};

evm.$ = function(selector) {
  return evm('#' + selector);
};
evm.className = function(selector, root, tag) {
  return evm('.' + selector, root, tag);
};
evm.tag = function(tag, root) {
  return evm(tag, root);
};

evm.ajax = ajax;
evm.css = css;
evm.chunk = chunk;
evm.cookie = cookie;
evm.cutCookie = cutCookie;
evm.extend = extend;
evm.forEach = forEach;
evm.getStbBrowser = getStbBrowser;
evm.getStyle = getStyle;
evm.controller = controller;
evm.html = html;
evm.inherit = inherit;
evm.intersection = intersection;
evm.isBoolean = isBoolean;
evm.isFunction = isFunction;
evm.isNumber = isNumber;
evm.isObject = isObject;
evm.isString = isString;
evm.makePublisher = makePublisher;
evm.merge = merge;
evm.on = on;
evm.off = off;
evm.one = one;
evm.restrict = restrict;
evm.subtract = subtract;
evm.text = text;
evm.trim = trim;
evm.throttle = throttle;
evm.union = union;

})(this);
 /* Thank you for using evm.js. */