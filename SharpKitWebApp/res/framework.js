if (!window.console) {
    window.console = {
        log: function() {

        }
    };
}
var IS_REDIRECT = false;
var js = {
    _doc: document,

    isChrome: (navigator.userAgent.toLowerCase().indexOf('chrome') > -1),
    _uniqueIdx: 0,
    _eventHandlers: [],
    isIE6: (navigator.userAgent.toLowerCase().indexOf('msie 6') != -1),
    isIE7: function() {
        var rv = -1;
        var ua = navigator.userAgent;
        var re = new RegExp("Trident\/([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            rv = parseFloat(RegExp.$1);
        }
        var res = (document.all && rv == -1);
        return res;
    }(),
    isIE8: function() {
        var rv = -1;
        var ua = navigator.userAgent;
        var re = new RegExp("Trident\/([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            rv = parseFloat(RegExp.$1);
        }
        var res = (document.all && rv == 4);
        return res;
    }(),
    isIE9: function() {
        var rv = -1;
        var ua = navigator.userAgent;
        var re = new RegExp("Trident\/([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            rv = parseFloat(RegExp.$1);
        }
        var res = (document.all && rv == 5);
        return res;
    }(),
    isIE: (navigator.appName == "Microsoft Internet Explorer"), ///MSIE (\d+\.\d+);/.test(navigator.userAgent),
    isOpera: function() {
        var isOpera = (navigator.userAgent.match(/Opera|OPR\//) ? true : false);
        return isOpera;
    }(),
    isSafari: function() {
        var isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
        return isSafari;
    }(),
    isMoz: function() { return !this.isIE && !this.isChrome && !this.isOpera && !this.isSafari; }(),

    redirect: function(url) {
        IS_REDIRECT = true;
        document.location.href = url;
    },

    getTimezoneOffset : function() {
        var date = new Date();
        var res = -date.getTimezoneOffset() / 60;
        return res;
    },

    debug:function() {
        debugger;
    },

    createGuid : function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },

    getSrcElement: function(ev) {
        var res;
        if (ev.explicitOriginalTarget) {
            res = ev.explicitOriginalTarget;
            if (!res.tagName) {
                res = res.parentNode;
            }
        } else if (ev.srcElement) {
            res = ev.srcElement;
        } else {
            res = ev.target;
        }
        return res;
    },

    getEventKeyCode: function (ev) {
        return ev.keyCode;
    },

    getRelativeParent: function(el) {
        var relativeParent = el;
        while (relativeParent && relativeParent != document.body && (
            (js.getStyle(relativeParent, "overflow") != "hidden") &&
                (js.getStyle(relativeParent, "position") != "relative") &&
                (js.getStyle(relativeParent, "position") != "absolute")
        )) {
            relativeParent = relativeParent.parentNode;
        }
        return relativeParent;
    },

    getParentByClassName: function(obj, className) {
        var obj_parent = obj.parentNode;
        if (!obj_parent) return false;
        if (js.hasClass(obj_parent, className)) return obj_parent;
        else return js.getParentByClassName(obj_parent, className);
    },

    getById: function(id, cont) {
        var res = null;
        if (!cont) {
            res = this._doc.getElementById(id);
        } else {
            if (cont.getElementById) {
                res = cont.getElementById(id);
            } else if (cont.children) {
                for (var i = 0, len = cont.children.length; i < len; ++i) {
                    var el = cont.children[i];
                    if (el.id == id) {
                        res = el;
                        break;
                    }
                    if (el.children.length) {
                        res = this.getById(id, el);
                        if (res) {
                            break;
                        }
                    }
                }
            }
        }
        return res;
    },

    getEventButton: function(ev) {
        var res = ev.button || ev.which;
        return res;
    },

    url: function(url) {
        var loc = js._doc.location;
        var virtualDirectory = window._virtualDirectory ? "/"
            + window._virtualDirectory : "";
        var res = loc.protocol + '/' + '/' + loc.host + virtualDirectory + '/'
            + url;
        return res;
    },

    mvcUrl: function(controller, view, id) {
        var res = controller + ".mvc";
        if (view) {
            res += "/" + view;
        }
        if (id) {
            res += "/" + id;
        }
        return this.url(res);
    },

    bind: function(func, context) {
        var args = [];
        if (arguments.length >= 3) {
            args.push(undefined); // event object insert here;
            for (var i = 2, len = arguments.length; i < len; ++i) {
                args.push(arguments[i]);
            }
        }
        return function() {
            js.assert(func);
            if (args.length) {
                // js.assert(1 == arguments.length);
                args[0] = arguments[0];
                return func.apply(context, args);
            } else {
                return func.apply(context, arguments);
            }
        };
    },

    _addEventHandlerIE: function(el, eventName, handler) {

        function fixEvent(ev) {
            ev.target = ev.target ? ev.target : ev.srcElement;
            if (typeof(handler) == 'string') {
                handler = handler.split('this').join('ev.target');
                return eval(handler);
            } else {
                return handler.apply(this, arguments);
            }
        }

        ;
        if (!this._eventHandlers[el.id]) {
            this._eventHandlers[el.id] = new Array();
        }
        if (!this._eventHandlers[el.id][eventName]) {
            this._eventHandlers[el.id][eventName] = new Array();
        }
        this._eventHandlers[el.id][eventName].push(fixEvent);
        return fixEvent;
    },

    attach: function (el, eventName, handler) {
        el = (typeof(el) == "string") ? this.getById(el) : el;
        js.assert(el);
        if (this.isIE) {
            var fixEvent = this._addEventHandlerIE(el, eventName, handler);

            el.attachEvent("on" + eventName, fixEvent);
            return fixEvent;
        } else {
            el.addEventListener(eventName, handler, false);
            return handler;
        }
    },

    detach: function(el, eventName, handler) {
        if (this.isIE) {
            if (this._eventHandlers[el.id]
                && this._eventHandlers[el.id][eventName]) {
                var handlers = this._eventHandlers[el.id][eventName];
                for (var i = 0, len = handlers.length; i < len; ++i) {
                    if (handlers[i] && handlers[i] == handler) {
                        handlers[i] = undefined;
                        break;
                    }
                }
            }
            el.detachEvent("on" + eventName, handler);
        } else {
            el.removeEventListener(eventName, handler, false);
        }
    },

    hasFocus: function(el) {
        return document.activeElement == el;
    },

    getStyle: function(el, val) {
        var res = undefined;

        if (window.getComputedStyle) {
            var stl = window.getComputedStyle(el);
            res = stl.getPropertyValue(val);
        } else {
            res = el.currentStyle[val];
        }

        return res;
    },

    getIntFromPx: function(element, px) {
        var style = js.getStyle(element, px);
        return parseInt(style.substring(0, style.length - 2));
    },

    setVisible: function(el, visible) {
        if (visible) {
            js.removeClass(el, "js-displayNone");
        } else {
            js.addClass(el, "js-displayNone");
        }
    },

    getStyleVal: function(el, val) {
        var res = 0;

        var str = this.getStyle(el, val);
        if (str && ~str.indexOf("px")) {
            var n = str.toString().replace("px", "");
            res = parseInt(n, 10);
        }

        return res;
    },

    getTextWidth: function(text) {
        if (!this._emptyDiv) {
            var div = this._doc.createElement("div");
            div.style.position = "absolute";
            div.style.top = "-9999px";
            div.style.left = "-9999px";
            js._emptyDiv = div;
            this._doc.body.appendChild(div);
        }
        this._emptyDiv.innerHTML = text;
        var val = this._emptyDiv.offsetWidth;
        return val;
    },

    addClass: function(el, className) {
        if (!this.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    },

    removeClass: function(el, className) {
        if (this.hasClass(el, className)) {
            var regExp = new RegExp(className, "gi");
            el.className = el.className.replace(regExp, "");
        }
    },
    toogleClass: function(el, className) {
        if (this.hasClass(el, className)) {
            var regExp = new RegExp(className, "gi");
            el.className = el.className.replace(regExp, "");
        } else {
            el.className += ' ' + className;
        }
    },
    hasClass: function(el, className) {
        js.assert(el);

        var elClass = el.className;
        var res = false;
        if (elClass) {
            var idx = elClass.indexOf(className);
            if (-1 != idx) {
                var str = elClass.substr(idx);
                if (str == className) {
                    res = true;
                } else {
                    var len = className.length;
                    if (str.length >= len) {
                        var lastChar = (str.length > len) ? str
                            .charAt(className.length) : ' ';

                        str = str.substr(0, className.length);
                        if (str == className && lastChar == ' ') {
                            res = true;
                        }
                    }
                }
            }
        }
        return res;
    },

    getInnerText: function(el) {
        var res = el.innerHTML.replace(/<[^>]+>/g, "");
        res = res.replace(/^\s+|\s+$/g, '');
        return res;
    },

    contains: function(cont, el) {
        var res = false;
        if (cont == el) {
            res = true;
        } else {
            for (var i = 0, len = cont.children.length; i < len; ++i) {
                var item = cont.children[i];
                if (item == el) {
                    res = true;
                    break;
                } else if (item.children.length) {
                    res = this.contains(item, el);
                    if (res) {
                        break;
                    }
                }
            }
        }

        return res;
    },

    getByClass: function(cont, className) {
        var res = [];
        if (!cont.getElementsByClassName) {
            for (var i = 0, len = cont.children.length; i < len; ++i) {
                var item = cont.children[i];
                if (this.hasClass(item, className)) {
                    res[res.length] = item;
                } else if (item.children.length) {
                    var tmpRes = this.getByClass(item, className);
                    if (tmpRes && tmpRes.length) {
                        for (var j = 0, lenj = tmpRes.length; j < lenj; ++j) {
                            res[res.length] = tmpRes[j];
                        }
                    }
                }
            }
        } else {
            res = cont.getElementsByClassName(className);
        }
        return res;
    },

    getOneByClass: function(cont, className) {
        js.assert(this.getByClass(cont, className).length == 1);

        var res = js._processGetOneByClass(cont, className);
        return res;
    },

    _processGetOneByClass: function(cont, className) {
        var res = undefined;
        if (!cont.getElementsByClassName) {
            for (var i = 0, len = cont.children.length; i < len; ++i) {
                var item = cont.children[i];
                if (this.hasClass(item, className)) {
                    res = item;
                    break;
                } else if (item.children.length) {
                    var tmpRes = this._processGetOneByClass(item, className);
                    if (tmpRes) {
                        res = tmpRes;
                        break;
                    }
                }
            }
        } else {
            res = cont.getElementsByClassName(className)[0];
        }
        return res;
    },

    getByTagName: function(cont, tagName) {
        return cont.getElementsByTagName(tagName);
    },

    getByName: function(name) {
        var els = document.getElementsByName(name);
        return els;
    },

    getOneByTagName: function(cont, tagName) {
        var els = this.getByTagName(cont, tagName);
        js.assert(els.length == 1);
        return els[0];
    },

    getChildren: function(cont) {
        js.assert(cont.children);
        return cont.children;
    },

    getParent: function(cont, parentTagName) {
        var parNode = cont.parentNode;
        var res = null;
        if (!parentTagName) {
            res = parNode;
        } else {
            if (parNode.tagName.toLowerCase() == parentTagName) {
                res = parNode;
            } else if (parNode.tagName.toLowerCase() == 'body') {
                res = null;
            } else {
                res = this.getParent(parNode, parentTagName);
            }
        }
        return res;
    },

    getFirstChild: function(cont) {
        return this.getChildren(cont)[0];
    },

    cancelEvent: function(ev) {
        if (ev.preventDefault) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        ev.returnValue = false;
    },

    extend: function(some, base) {
        var f = function() {
        };
        f.prototype = base.prototype;
        some.prototype = new f;
        some.prototype.constructor = some;
        some.supper = base.prototype;
    },

    generateId: function() {
        var id = "c_" + this._uniqueIdx++;
        this.assert(!this.getById(id));
        return id;
    },

    log: function(msg, level) {
        if (!this._myLog) {
            this._myLog = new function() {
                this._el = js._doc.createElement("div");
                this._title = js._doc.createElement("div");
                this._close = js._doc.createElement("div");
                this._close.innerHTML = "X";
                this._title.innerHTML = "Logger";
                this._ta = js._doc.createElement("textarea");
                js.addClass(this._el, "js-log");
                js.addClass(this._close, "js-log-close");
                js.addClass(this._ta, "js-log-textarea");
                js.addClass(this._title, "js-log-title");

                var data = {
                    el: this._el,
                    dragEl: this._title
                };
                js.drag.register(data);
                this._el.appendChild(this._title);
                this._title.appendChild(this._close);

                js.attach(this._close, "click", js.bind(function() {
                    this._el.style.display = "none";
                }, this));

                this._el.appendChild(this._ta);
                js._doc.body.appendChild(this._el);

                this.log = function(val) {
                    this._ta.value = "log:" + val + "\n" + this._ta.value;
                };

                this.error = function(val) {
                    this._ta.value = "error:" + val + "\n" + this._ta.value;
                };
            };
        }
    },

    assert: function(exp, msg) {
        if (!exp) {
            if (!msg) {
                msg = arguments.caller;
            }
            if (confirm("ASSERT:" + msg)) {
                debugger;
            }
        }
    },

    fireEvent: function(el, eventName) {
        el = (typeof(el) == "string") ? this.getById(el) : el;
        if (document.createEventObject) {
            var evt = document.createEventObject();
            evt["target"] = el;
            if ('change' == eventName && this._eventHandlers[el.id]
                && this._eventHandlers[el.id][eventName]) {
                var handlers = this._eventHandlers[el.id][eventName];
                for (var i = 0, len = handlers.length; i < len; ++i) {
                    if (handlers[i]) {
                        handlers[i](evt);
                    }
                }
            } else {
                // dispatch for IE
                return el.fireEvent('on' + eventName, evt);
            }
        } else {
            // dispatch for firefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventName, true, true); // event
            // type,bubbling,cancelable
            return !el.dispatchEvent(evt);
        }
    },

    isElementInForm: function (id) {
        var childNodes = document.forms[0].childNodes;
        for (var l = 0 - 1; l < childNodes.length ; l++) {
            var childNode = childNodes[l];
            if (childNode && childNode.id != undefined) {
                if (childNode.id == id)
                    return true;
            }
        }
        return false;
    },

    getXY: function(el, cont) {
        cont = cont ? cont : this._doc.documentElement;
        var x = 0, y = 0;

        if (js.isChrome) {
            while (el) {
                x += el.offsetLeft;
                y += el.offsetTop;

                el = el.offsetParent;
                if (el == cont || !js.contains(cont, el)) {
                    break;
                }
            }
        } else {
            while (el) {
                x += el.offsetLeft + el.scrollLeft;
                y += el.offsetTop + el.scrollTop;

                el = el.offsetParent;
                if (el == cont || !js.contains(cont, el)) {
                    break;
                }
            }
        }
        return {
            x: x,
            y: y
        };
    },

    getEventXY: function(ev) {
        var x = ev.pageX ? ev.pageX : ev.clientX;
        var y = ev.pageY ? ev.pageY : ev.clientY;
        return {
            x: x,
            y: y
        };
    },

    selectText: function(inp, start, end) {
        end = end || start;
        if (inp.createTextRange) {
            var r = inp.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();
        } else if (inp.setSelectionRange) {
            inp.focus();
            inp.setSelectionRange(start, end);
        }
    },

    selectAll: function(inp) {
        var val = inp.value;
        if (val) {
            this.selectText(inp, 0, val.length);
        } else {
            this.selectText(inp, 0, 0);
        }
    },

    getSelectedText: function(elem) {
        var res = "";
        var ss = elem.selectionStart;
        var se = elem.selectionEnd;
        if (typeof ss === "number" && typeof se === "number") {
            res = elem.value.substring(elem.selectionStart, elem.selectionEnd);
        } else {
            elem.focus();
            res = document.selection.createRange().text;
        }
        return res;
    },

    getCaretPos: function(el) {
        if (el.selectionStart) {
            return el.selectionStart;
        } else if (document.selection) {
            el.focus();

            var r = document.selection.createRange();
            if (r == null) {
                return 0;
            }

            var re = el.createTextRange();
            var rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);

            var addNewlines = 0;
            for (var i = 0, len = rc.text.length; i < len; ++i) {
                if (rc.text.substr(i, 2) == '\r\n') {
                    addNewlines += 2;
                    i++;
                }
            }

            return rc.text.length + addNewlines;
        }
        return 0;
    },

    setCaretPos: function(el, pos) {
        this.selectText(el, pos, pos);
    },

    setCookie: function(name, value, exSec) {
        if (!exSec) {
            exSec = 1;
        }
        var exdate = new Date();
        exdate.setSeconds(exdate.getSeconds() + exSec);
        var cValue = escape(value) + "; expires=" + exdate.toGMTString() + "; path=/";
        document.cookie = name + "=" + cValue;
    },

    getCookie: function(name) {
        var i, x, y, cookiesList = document.cookie.split(";");
        for (i = 0; i < cookiesList.length; i++) {
            x = cookiesList[i].substr(0, cookiesList[i].indexOf("="));
            y = cookiesList[i].substr(cookiesList[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == name) {
                return unescape(y);
            }
        }
        return "";
    },

    removeCookie: function(name) {
        this.setCookie(name, "", -1);
    },

    deleteCookie: function(name) {
        this.setCookie(name, "", -1);
    },

    hasCookie: function(name) {
        var res = false;
        var username = this.getCookie(name);
        if (username != null && username != "") {
            res = true;
        }
        return res;
    },

    eval: function(exp, arg) {
        try {
            exp = exp.toString().replace(/this/g, 'arg');
            return eval(exp);
        } catch(ex) {
            js.assert(false, ex);
        }
    },

    getWindowInnerHeight: function() {
        return window.innerHeight || $(window).innerHeight();
    },
    getElementsByClassName: function(className) {
        var elements;
        if (document.all && !document.addEventListener) {
            elements = document.querySelectorAll("." + className);
        } else {
            elements = document.getElementsByClassName(className);
        }
        return elements;
    },
    getChildIndex: function(el) {
        var res = -1;
        var par = el.parentNode;
        var children = js.getChildren(par);
        for (var i = 0, len = children.length; i < len; ++i) {
            if (children[i] == el) {
                res = i;
                break;
            }
        }
        return res;
    },
    getParentByTagName: function(div, tagName) {
        var res;
        var par = div;
        while (par) {
            if (par.tagName.toUpperCase() == tagName.toUpperCase()) {
                res = par;
                break;
                ;
            }
            par = par.parentNode;
        }
        return res;

    },
    isVisible: function(el) { return js.getCurrentStyle(el).display != "none"; },
    getCurrentStyle: function(el) {
        if (el.currentStyle) {
            return el.currentStyle;
        } else if (el.getComputedStyle) {
            return el.getComputedStyle();
        }
        return el.style;
    }
};

js.json = function() {
    /*
    * convert json object to string.
    */
    this.serealize = function(json) {
        var str = '';

        var separator = js.settings.inst().getDateSeparator();

        if (!json) {
            str = null;
        } else if (json.getTime && json.setTime) {
            if (js.utils.equalsDate(json, Date.MIN_VALUE)) {
                str = '"' + "01" + separator + "01" + separator + "0001" + '"';
            } else {
                str = '"' + (json.getMonth() + 1) + separator + json.getDate() + separator + json.getFullYear()
                    + ' ' + json.getHours() + ":" + json.getMinutes() + ":" + json.getSeconds() + '"';
            }
        } else if (json.length == 0) {
            str = '[]';
        } else if (json.length > 0) {
            str = '[';
            for (var i = 0, len = json.length; i < len; ++i) {
                if (typeof(json[i]) == "object") {
                    str += js.json.serealize(json[i]) + ",";
                } else {
                    str += '"' + js.utils.escape(json[i]) + '"' + ",";
                }
            }
            if (str.length && str.charAt(str.length - 1) == ",") {
                str = str.substr(0, str.length - 1);
            }
            str += ']';
        } else {
            str = '{';
            for (var c in json) {
                var obj = json[c];
                if (typeof(obj) == "object") {
                    str += '"' + js.utils.escape(c) + '":'
                        + js.json.serealize(obj) + ',';
                } else if (typeof(obj) == "function") {
                } else {

                    if (undefined === obj) {
                        obj = null;
                    } else if ("string" == typeof(obj)) {
                        obj = '"' + js.utils.escape(obj) + '"';
                    } else if ("number" == typeof(obj)) {
                    } else if ("boolean" == typeof(obj)) {
                    } else if ("" == obj) {
                        obj = '""';
                    }

                    str += '"' + js.utils.escape(c) + '":' + obj + ',';
                }
            }
            if (str.length && str.charAt(str.length - 1) == ",") {
                str = str.substr(0, str.length - 1);
            }
            str += '}';
        }
        return str;
    };

    /*
    * convert string to json.
    */
    this.deserialize = function(str) {
        var obj = null;
        try {
            obj = eval("obj=" + str);
        } catch(e) {
        }
        return obj;
    };
};
js.json = new js.json();

js.math = function() {
    this.abs = function(x) {
        return Math.abs(x);
    };

    this.min = function(a, b) {
        return Math.min(a, b);
    };
    this.max = function (a, b) {
        return Math.max(a, b);
    };
};
js.math = new js.math();

js.ajax = function() {
    var _xmlHttpFactories = [function() {
        return new XMLHttpRequest();
    }, function() {
        return new ActiveXObject("Msxml2.XMLHTTP");
    }, function() {
        return new ActiveXObject("Msxml3.XMLHTTP");
    }, function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }];

    this.get = function(url, success, failed) {
        sendRequest("GET", url, undefined, success, failed, true);
    };

    this.post = function(url, data, success, failed) {
        var jsonData = js.json.serealize(data);
        sendRequest("POST", url, jsonData, success, failed, true);
    };

    this.getSync = function(url, success, failed) {
        sendRequest("GET", url, undefined, success, failed, false);
    };

    this.postSync = function(url, data, success, failed) {
        var jsonData = js.json.serealize(data);
        var req = sendRequest("POST", url, jsonData, success, failed, false);

        function run(ev, req) {
            if (req && req.readyState != 4) {
                req.abort();
            }
        }

        ;
        window.setTimeout(js.bind(run, this, req), 10000);
    };

    this.crossDomainGet = function(url, success, failed) {
        if (js.isIE) {
            sendCrossDomainRequest("GET", url, undefined, success, failed, true);
        } else {
            sendRequest("GET", url, undefined, success, failed, true);
        }
    };

    this.crossDomainPost = function(url, data, success, failed) {
        var jsonData = js.json.serealize(data);
        if (js.isIE) {
            sendCrossDomainRequest("POST", url, jsonData, success, failed, true);
        } else {
            sendRequest("POST", url, jsonData, success, failed, true);
        }
    };

    function sendCrossDomainRequest(method, url, postData, success, failed, async) {
        var req = new XDomainRequest();
        if (req) {
            var time = new Date();
            time = time.getTime();
            if (-1 != url.indexOf('?')) {
                url += "&time=" + time;
            } else {
                url += "?time=" + time;
            }

            req.open(method, url, async);

            req.onload = function() {
                if (success) {
                    var obj = js.json.deserialize(req.responseText);
                    var str = req.responseText;
                    req = undefined;
                    success(obj, str);
                }
            };
            req.onerror = req.ontimeout = function() {

                if (failed) {
                    failed(req.responseText);
                }
                req = undefined;
            };
            if (req.readyState != 4) {
                req.send(postData);
            }
        }
    }

    ;

    function sendRequest(method, url, postData, success, failed, async) {
        var req = createXMLHTTPObject();
        if (req) {
            var time = new Date();
            time = time.getTime();
            if (-1 != url.indexOf('?')) {
                url += "&time=" + time;
            } else {
                url += "?time=" + time;
            }

            req.open(method, url, async);
            //req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (postData) {
                req.setRequestHeader('Accept',
                    'application/json, text/javascript, */*');
                req.setRequestHeader('Content-type',
                    'application/json; charset=utf-8');
                //req.setRequestHeader("Content-length", postData.length);
                req.setRequestHeader("Cache-Control", "no-cache");
                //req.setRequestHeader("Connection", "close");
            }
            req.onreadystatechange = function() {
                postData = undefined;

                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (success) {
                            var obj = js.json.deserialize(req.responseText);
                            var str = req.responseText;
                            req = undefined;
                            success(obj, str);
                        }
                    } else {
                        if (failed) {
                            failed(req);
                        } else {
                        }
                        req = undefined;
                    }
                }
            };
            if (req.readyState != 4) {
                req.send(postData);
            }
        }
        return req;
    }

    ;

    function createXMLHTTPObject() {
        var xmlhttp = "";
        for (var i = 0, len = _xmlHttpFactories.length; i < len; i++) {
            try {
                xmlhttp = _xmlHttpFactories[i]();
                break;
            } catch(e) {
            }
        }
        return xmlhttp;
    }

    ;
};
js.ajax = new js.ajax();

js.post = function(url, data, callBack) {
    var self = this;
    var bd = self._iframe.contentWindow.document.body;
    var form = js._doc.createElement("form");
    bd.appendChild(form);

    form.action = url;
    form.method = "post";
    for (var key in data) {
        var jsonData = data[key];
        if (typeof(jsonData) != "string") {
            jsonData = js.json.serealize(data[key]);
        }
        var input = js._doc.createElement("input");
        if (-1 != key.toLowerCase().indexOf('password')) {
            input.type = "password";
        } else {
            input.type = "hidden";
        }
        input.name = input.id = key;
        input.value = jsonData;
        form.appendChild(input);
    }

    form.submit();

    if (callBack) {
        callBack();
    }
};

js.attach(window, "load", js.bind(function() {
    if (!this._iframe) {
        this._iframe = js._doc.createElement("iframe");
        this._iframe.style.position = "absolute";
        this._iframe.style.left = "-99999px";
        this._iframe.style.top = "-99999px";
        js._doc.body.appendChild(this._iframe);
    }
}, js));

/*
 * js.error
 */
js.error = function() {
    this.log = function(e) {
        var trace = "javascript error:<br/>";

        try {
            trace += printStackTrace();
            trace += "<br/>";
            for (var i in e) {
                trace += i + " = " + e[i] + "<br/>";
            }

            /*
			js.ajax.post(js.mvcUrl("Error", "SendError"), { message: trace }, function(res) {
			});
			 */
        } catch(ex) {
        }
    };
};
js.error = new js.error();

js.utils = function() {
    this.indexOf = function(arr, find, i /*opt*/) {
        var res = -1;
        if (i === undefined) {
            i = 0;
        }
        if (i < 0) {
            i += arr.length;
        }
        if (i < 0) {
            i = 0;
        }
        if (typeof(find) == "function") {
            for (var n = arr.length; i < n; i++) {
                if (i in arr && find(arr[i])) {
                    res = i;
                    break;
                }
            }
        } else {
            for (var n = arr.length; i < n; i++) {
                if (i in arr && arr[i] === find) {
                    res = i;
                    break;
                }
            }
        }
        return res;
    };

    this.dateFromJsonDate = function(jsonStr) {
        if (jsonStr && typeof(jsonStr) == "object" && jsonStr.getTime) {
            return jsonStr;
        }
        return new Date(parseInt(jsonStr.substr(6, jsonStr.length - 8)));
    };

    this.formatDate = function(date, addTime) {
        var res, dd, mm, yy, hh, m;
        if (date) {
            res = date;
        } else {
            res = new Date();
        }
        dd = res.getDate();
        mm = res.getMonth() + 1;
        yy = res.getFullYear();
        hh = res.getHours();
        m = res.getMinutes();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (hh < 10) {
            hh = '0' + hh;
        }

        var separator = js.settings.inst().getDateSeparator();
        var res = mm + separator + dd + separator + yy;
        if (addTime) {
            res = res + ' ' + hh + ":" + m;
        }
        return res;
    };

    this.contains = function(items, obj) {
        var res = false;
        if (typeof(obj) == "function") {
            for (var i = 0, len = items.length; i < len; ++i) {
                if (obj(items[i])) {
                    res = true;
                    break;
                }
            }
        } else {
            for (var i = 0, len = items.length; i < len; ++i) {
                if (items[i] == obj) {
                    res = true;
                    break;
                }
            }
        }
        return res;
    };


    this.htmlDecode = function(str) {
        if (str && (typeof(str) == "string")) {
            return str.replace(/&/g, '&amp;')
                //.replace(/<br>/g, '\r\n')
                .replace(/</g, '&lt;').replace(/"/g, '&quot;')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        return str;
    };

    this.combine = function(arr1, arr2) {
        var res = [];

        for (var i = 0, len = arr1.length; i < len; ++i) {
            res.push(arr1[i]);
        }
        for (var i = 0, len = arr2.length; i < len; ++i) {
            res.push(arr2[i]);
        }

        return res;
    };

    this.htmlEncode = function(str) {
        if (str && (typeof(str) == "string")) {
            return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            //.replace(/\r\n/g, '<br>');
        }
        return str;
    };

    this.escape = function(str) {
        if (str && (typeof(str) == "string")) {
            return str.replace(/[\\]/g, '\\\\').replace(/[\"]/g, '\\"')
                .replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(
                    /[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(
                        /[\r]/g, '\\r').replace(/[\t]/g, '\\t');
        }
        return str;
    };

    this.escapeEndLine = function(str) {
        if (str && (typeof(str) == "string")) {
            return str.replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r');
        }
        return str;
    };

    this.setTimeout = function(fn, time) {

        function handler() {
            if (window._res) {
                window.clearTimeout(window._res);
            }
            fn();
            fn = undefined;
            handler = undefined;
        }

        window._res = window.setTimeout(handler, time);
    };

    this.orderBy = function(array, field) {
        array = array.sort(function(obj1, obj2) {
            if (obj1[field] > obj2[field]) {
                return 1;
            }
            if (obj1[field] < obj2[field]) {
                return -1;
            }
            return 0;
        });
        return array;
    },
    this.orderByDesc = function(array, field) {
        array = array.sort(function(obj1, obj2) {
            if (obj1[field] > obj2[field]) {
                return -1;
            }
            if (obj1[field] < obj2[field]) {
                return 1;
            }
            return 0;
        });
        return array;
    },
    this.single = function(array, key, value) {
        return this.where(array, key, value)[0];
    },
    this.filter = function(array, key, value) {
        var res = [];
        for (var i = 0, len = array.length; i < len; ++i) {
            var val1 = array[i][key].toLowerCase();
            var val2 = value.toLowerCase();
            var isEqual = true;
            for (var j = 0, len2 = val2.length; j < len2; ++j) {
                if (val1[j] != val2[j]) {
                    isEqual = false;
                    break;
                }
            }
            if (isEqual) {
                res.push(array[i]);
            }
        }
        return res;
    };

    this.where = function(array, key, value) {
        var res = [];
        js.assert(array);
        if (typeof(key) == "function") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (key(array[i], i)) {
                    res.push(array[i]);
                }
            }
        } else {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i][key] == value) {
                    res.push(array[i]);
                }
            }
        }
        return res;
    };

    this.remove = function(array, key, value) {
        var res = [];
        if (typeof(key) == "string") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i][key] != value) {
                    res.push(array[i]);
                }
            }
        } else if (typeof(key) == "number") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (i != key) {
                    res.push(array[i]);
                }
            }
        } else if (typeof(key) == "function") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (!key(array[i])) {
                    res.push(array[i]);
                }
            }
        } else {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i] != key) {
                    res.push(array[i]);
                }
            }
        }
        while (array.length) {
            array.pop();
        }
        for (var i = 0, len = res.length; i < len; ++i) {
            array.push(res[i]);
        }
        return array;
    };

    this.insert = function(array, idx, value) {
        var res = [];
        for (var i = 0; i < idx; ++i) {
            res.push(array[i]);
        }
        res.push(value);
        for (var i = idx, len = array.length; i < len; ++i) {
            res.push(array[i]);
        }
        while (array.length) {
            array.pop();
        }
        for (i = 0, len = res.length; i < len; ++i) {
            array.push(res[i]);
        }
        return array;
    };

    /* find select and input controls */
    this.getInputControls = function(cnt) {
        var res = [];

        var els = js.getByTagName(cnt, "SELECT");
        for (var i = 0, len = els.length; i < len; ++i) {
            res[res.length] = els[i];
        }

        var els = js.getByTagName(cnt, "TEXTAREA");
        for (var i = 0, len = els.length; i < len; ++i) {
            res[res.length] = els[i];
        }

        els = js.getByTagName(cnt, "INPUT");
        for (var i = 0, len = els.length; i < len; ++i) {
            if (els[i].parentNode.className != "js-select-editor") {
                res[res.length] = els[i];
            }
        }

        return res;
    };

    /* find select and input controls */
    this.getCustomControls = function(cnt) {
        var res = [];
        var els = js.utils.getInputControls(cnt);
        var labels = js.getByTagName(cnt, "label");
        if (labels) {
            for (var i = 0, len = labels.length; i < len; ++i) {
                els.push(labels[i]);
            }
            ;
        }

        for (i = 0, len = els.length; i < len; ++i) {
            var ctrl = js.control.get(els[i].id);
            if (ctrl) {
                res.push(ctrl);
            }
        }
        ;

        return res;
    };

    this.createCustomControls = function(cnt, readonly) {
        var res = [];

        var els = js.getByTagName(cnt, "BUTTON");
        if (els) {
            for (var i = 0, len = els.length; i < len; ++i) {
                if (!js.control.isDisabled(els[i])) {
                    js.control.setReadonly(els[i], readonly);
                }
            }
        }

        els = js.utils.getInputControls(cnt);
        var labels = js.getByTagName(cnt, "label");
        if (labels) {
            for (i = 0, len = labels.length; i < len; ++i) {
                els.push(labels[i]);
            }
            ;
        }

        for (i = 0, len = els.length; i < len; ++i) {
            if (!els[i].id) {
                els[i].id = js.generateId();
            }
            var ctrl = undefined;
            if (els[i].tagName == "TEXTAREA") {
                ctrl = js.control.create(js.textarea, {
                    id: els[i]
                });
            } else if (els[i].tagName == "LABEL") {
                ctrl = js.control.create(js.label, {
                    id: els[i]
                });
            } else if (els[i].tagName == "SELECT") {
                var type = els[i].getAttribute("type");
                if (type == "js.dropDownWithEditablePopup") {
                    ctrl = js.control.create(js.dropDownWithEditablePopup, {
                        id: els[i]
                    });
                } else if (type == "js.multibutton") {
                    ctrl = js.control.create(js.dropDownButton, {
                        id: els[i]
                    });
                } else if (type == "js.selectAsync") {
                    ctrl = js.control.create(js.selectAsync, {
                        id: els[i]
                    });
                } else {
                    ctrl = js.control.create(js.select, {
                        id: els[i]
                    });
                }
            } else if (els[i].tagName == "INPUT") {
                if (els[i].type.toLowerCase() == "text"
                    && js.hasClass(els[i], "js-input-numeric")) {
                    ctrl = js.control.create(js.numeric, {
                        id: els[i]
                    });
                } else if (els[i].type.toLowerCase() == "text" && js.hasClass(els[i], "js-input-datebox")) {
                    ctrl = js.control.create(js.datebox, {
                        id: els[i]
                    });
                } else if (els[i].type.toLowerCase() == "text") {
                    ctrl = js.control.create(js.textbox, {
                        id: els[i]
                    });
                } else if (els[i].type.toLowerCase() == "checkbox") {
                    ctrl = js.control.create(js.checkbox, {
                        id: els[i]
                    });
                } else if (els[i].type.toLowerCase() == "radio") {
                    ctrl = js.control.create(js.radiobutton, {
                        id: els[i]
                    });
                }
            }
            if (ctrl) {
                res.push(ctrl);
                if (!ctrl.isDisabled()) {
                    ctrl.setReadonly(readonly);
                }
            }
        }
        return res;
    };

    this.clone = function(obj) {
        var newObj;

        if (obj && typeof(obj) == "object" && obj.getTime) {
            newObj = new Date();
            newObj.setTime(obj.getTime());
        } else if (!obj) {
            newObj = obj;
        } else if (obj.length >= 0 && typeof(obj) != "string") {
            newObj = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                newObj[i] = this.clone(obj[i]);
            }
        } else if (valType == "string" || valType == "number"
            || valType == "boolean") {
            newObj = obj;
        } else {
            newObj = {};
            for (var c in obj) {
                var val = obj[c];
                var valType = typeof(val);
                if (val && val.clone) {
                    newObj[c] = val.clone();
                } else if (valType == "string" || valType == "number"
                    || valType == "boolean") {
                    newObj[c] = val;
                } else {
                    newObj[c] = this.clone(val);
                }
            }
        }

        return newObj;
    };

    this.toBool = function(val) {
        var res = false;
        if (val == 1 || val == true || val == "True" || val == "true") {
            res = true;
        }
        return res;
    };

    this.foreach = function(els, fn) {
        if (els && els.length) {
            for (var i = 0, len = els.length; i < len; ++i) {
                fn(els[i], i);
            }
        }
    };

    this.select = function(els, fn) {
        var res = [];
        if (els && els.length) {
            if (typeof(fn) == "function") {
                for (var i = 0, len = els.length; i < len; ++i) {
                    var o = fn(els[i], i);
                    res.push(o);
                }
            } else {
                for (var i = 0, len = els.length; i < len; ++i) {
                    var o = els[i][fn];
                    res.push(o);
                }
            }
        }
        return res;
    };

    this.copyStyle = function(stlDest, stlSource) {
        stlDest.minWidth = stlSource.minWidth;
        stlDest.maxWidth = stlSource.maxWidth;
        stlDest.width = stlSource.width;
        stlDest.display = stlSource.display;
        stlDest.textAlign = stlSource.textAlign;
    };

    this.equalsDate = function(date1, date2) {
        if (date1.getDate() == date2.getDate()
            && date1.getMonth() == date2.getMonth()
            && date1.getFullYear() == date2.getFullYear()) {
            return true;
        }
        return false;
    };

    this.parseDate = function(txt) {
        var res = null;
        if (txt) {
            if (txt.getFullYear && txt.getDate) {
                res = txt;
            } else if (-1 != txt.indexOf('Date')) {
                res = new Date(eval(txt.replace(/\/Date\((\d+)\)\//gi,
                    "new Date($1)")));
            } else {
                var separator = js.settings.inst().getDateSeparator();

                var ymd = txt.split(separator); // year,month,day
                if (ymd.length == 3) {
                    try {
                        var month = parseInt(ymd[0], 10) - 1;
                        var day = ymd[1];

                        var idx = ymd[2].indexOf(' ');
                        var year = (idx != -1) ? ymd[2].substr(0, idx) : ymd[2];
                        var hms = (-1 == idx) ? [] : ymd[2].substr(idx).split(
                            ":"); // hours,minutes,secconds
                        var hours = hms[0] ? hms[0] : 0;
                        var minutes = hms[1] ? hms[1] : 0;
                        var seconds = hms[2] ? hms[2] : 0;
                        var date = new Date(year, month, day, hours, minutes,
                            seconds);
                        res = date;
                    } catch(ex) {
                    }
                }
            }
        }
        if (res && res.toString() == "NaN") {
            res = "";
        }
        return res;
    };
};
js.utils = new js.utils();

Date.prototype.getDayEx = function() {
    var n = this.getDay();
    if (n == 0) {
        return 6;
    } else {
        return (n - 1);
    }
};

Date.prototype.clone = function() {
    var dt = new Date();
    dt.setTime(this.getTime());
    return dt;
};

js.array = function(arg) {
    this._id = arg ? arg.id : js.generateId();
    this._items = [];

    this._addItem = new js.listener();
    this._removeItem = new js.listener();
    this._listChange = new js.listener();
    this._itemChange = new js.listener();
};

js.array.prototype.addItem = function(item) {
    this._items.push(item);
    this._addItem.fire(item);
};

js.array.prototype.removeItem = function(item) {
    js.utils.remove(this._items, item);
    this._removeItem.fire(item);
};

js.array.prototype.setValue = function(items) {
    this._items = items;
    this.fireListChange();
};

js.array.prototype.findById = function(id) {
    var it = js.utils.single(this.getEnumerator(), "id", id);
    return it;
};

js.array.prototype.setItem = function(item) {
    //js.assert(js.utils.contains(this._items, function(el) { return el.id == item.id; }));

    for (var i = 0, len = this._items.length; i < len; ++i) {
        if (this._items[i].id == item.id) {
            this._items[i] = item;

            this.fireItemChange(item);
            break;
        }
    }
};

js.array.prototype.get = function(idx) {
    return this._items[idx];
};

js.array.prototype.getLength = function(idx) {
    return this._items.length;
};

js.array.prototype.getEnumerator = function() {
    return this._items;
};

js.array.prototype.subscribeAddItem = function(callback) {
    this._addItem.subscribe(callback);
};

js.array.prototype.subscribeRemoveItem = function(callback) {
    this._removeItem.subscribe(callback);
};

js.array.prototype.subscribeListChange = function(callback) {
    this._listChange.subscribe(callback);
};

js.array.prototype.subscribeItemChange = function(callback) {
    this._itemChange.subscribe(callback);
};

js.array.prototype.fireListChange = function() {
    this._listChange.fire(this._items);
};

js.array.prototype.fireItemChange = function(item) {
    this._itemChange.fire(item);
};

/*dateSeparator*/
js.settings = function() {
    this._separator = ".";
};

js.settings.prototype.getDateSeparator = function() {
    js.assert(this._separator.length == 1);
    return this._separator;
};

js.settings.prototype.setDateSeparator = function(separator) {
    this._separator = separator;
};

js.settings.inst = function() {
    if (!js.settings._inst) {
        js.settings._inst = new js.settings();
    }
    return js.settings._inst;
};

//For IE8
Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
};

Array.prototype.move = function(old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};

Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};


Date.MIN_VALUE = new Date(1901, 0, 1);

js.callbackHelper = function() {
    var _fnIdx = 0;
    this._fns = [];

    this.callFn = function(fnName, arg) {
        var fn = this._fns[fnName];
        this._fns[fnName] = undefined;
        js.assert(fn);
        fn(arg);
    };

    this.generateFunctionName = function(fn) {
        var fnName = "fn_" + (_fnIdx++);
        this._fns[fnName] = fn;
        return fnName;
    };
};

js.callbackHelper.inst = function() {
    if (!js.callbackHelper._inst) {
        js.callbackHelper._inst = new js.callbackHelper();
    }
    return js.callbackHelper._inst;
};

js.crossDomainGet = function(url, callback) {
    var idx = url.lastIndexOf('/');
    var action = url.substr(idx + 1);

    var suburl = url.substr(0, idx);
    idx = suburl.lastIndexOf('/');
    var controller = suburl.substr(idx + 1);
    idx = controller.lastIndexOf('.');
    controller = controller.substr(0, idx);

    idx = suburl.lastIndexOf('/');
    var host = suburl.substr(0, idx + 1);

    var fnName = js.callbackHelper.inst().generateFunctionName(callback);
    var str = host + "jsonp.js?method=get&controller=" + controller + "&action=" + action + "&callback=" + fnName;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = str;
    script.onload = function() {
        document.body.removeChild(script);
    };
    document.body.appendChild(script);
};

js.crossDomainPost = function(url, data, success, failed) {
    var idx = url.lastIndexOf('/');
    var action = url.substr(idx + 1);

    var suburl = url.substr(0, idx);
    idx = suburl.lastIndexOf('/');
    var controller = suburl.substr(idx + 1);
    idx = controller.lastIndexOf('.');
    controller = controller.substr(0, idx);

    idx = suburl.lastIndexOf('/');
    var host = suburl.substr(0, idx + 1);

    var fnName = js.callbackHelper.inst().generateFunctionName(success);
    data = js.json.serealize(data);
    var str = host + "jsonp.js?method=post&controller=" + controller + "&action=" + action + "&args=" + data + "&callback=" + fnName;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = str;
    script.onload = function() {
        document.body.removeChild(script);
    };
    script.onerror = function() {
        if (failed) {
            failed();
        }
    };
    document.body.appendChild(script);
};