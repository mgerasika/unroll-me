var WEB_SOCKET_URL = "ws://194.44.247.146:8484/";

function server() {
    var self = this;
    var socket;
    this._handler;

    this.connect = function () {
        if (typeof (WebSocket) !== 'undefined') {
            socket = new WebSocket(WEB_SOCKET_URL);
        } else {
            socket = new MozWebSocket(WEB_SOCKET_URL);
        }

        socket.onmessage = function (msg) {
            console.log(msg.data);

            self._onReceive(msg.data);
        };

        socket.onopen = function (event) {
            console.log("open");
        };

        socket.onclose = function (event) {
            console.log("close");
        };
    };


    this.disconnect = function () {
    };

    this.subscribe = function (handler) {
        this._handler = handler;
    };

    this._onReceive = function (str) {
        if (null != this._handler) {
            var obj = js.json.deserialize(str);
            if (obj._cstype) {
                var inst = new SharpKitClient.entity[obj._cstype]();
                if (!inst) {
                    alert("Can't find class SharpKitClient.entity." + obj._cstype);
                }
                for (var name in obj) {
                    var val = obj[name];
                    if (inst["get_" + name] || inst["set_" + name]) {
                        inst['_' + name] = val;
                    } else {
                        inst[name] = val;
                    }

                }
                js.assert(inst.ClientId);
            }
            this._handler(inst);
        }
    };

    this.send = function (request) {
        var data = "";
        if (request) {
            request._cstype = request.get__cstype();
            data = JSON.stringify(request);
        }
        if (data) {
            socket.send(data);
        }

    };
};


var server = new server();