function commet() {
    var self = this;
    this._handler;
    this._url = "http://localhost:17189";
    var _id;

    this.connect = function (id) {
        _id = id;

        var url = this._url + '/CometAsyncHandler.ashx?cpsp=CONNECT&cid='+ _id;
        $.ajax({
            type: "POST",
            url: url,
            success: function (e) {
                console.log("connect");

                self.onReceive.call(self, e);
                self.send.call(self);
            },
            error: function (id) {
               window.setTimeout(js.bind(self.send,self), 5000);
            }
        });
    };

    this.isConnected = function() {
        return _id != undefined;
    };

    this.disconnect = function () {
        var url = this._url + '/CometAsyncHandler.ashx?cpsp=DISCONNECT&cid=' + _id;
        $.ajax({
            type: "POST",
            url: url,
            success: function (e) {
                console.log("disconnect");

                self.onReceive.call(self, e);
            },
            error: function (id) {
            }
        });
    };

    this.send = function (request) {
        var url = this._url + '/CometAsyncHandler.ashx?cid=' + _id;
        $.ajax({
            type: "POST",
            url: url,
            data: request ? JSON.stringify(request) : "",
            success: function (e) {
                self.onReceive.call(self, e);

                self.send.call(self);
            },
            error: function () {
                window.setTimeout(js.bind(self.send, self), 5000);
            }
        });
    };

    this.subscribe = function(handler) {
        this._handler = handler;
    };

    this.onReceive = function(str) {
        if (null != this._handler) {
            var obj = js.json.deserialize(str);
            if (obj._cstype) {
                var inst = new SharpKitWebApp.data[obj._cstype]();
                for (var name in obj) {
                    var val = obj[name];
                    if (inst["get_" + name] || inst["set_" + name]) {
                        inst['_' + name] = val;
                    } else {
                        inst[name] = val;
                    }

                }
            }
            this._handler(inst);
        }
    };
   
};


var commet = new commet();

function server() {
    var self = this;
    this._url = "http://localhost:17189";

    this.send = function (request) {
        var url = this._url + '/Server.aspx';
        $.ajax({
            type: "POST",
            url: url,
            data: request ? JSON.stringify(request) : "",
            success: function (e) {
            },
            error: function () {
            }
        });
    };

};


var server = new server();