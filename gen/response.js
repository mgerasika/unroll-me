/* Generated by SharpKit 5 v5.4.4 */
if (typeof ($Inherit) == 'undefined') {
	var $Inherit = function (ce, ce2) {

		if (typeof (Object.getOwnPropertyNames) == 'undefined') {

			for (var p in ce2.prototype)
				if (typeof (ce.prototype[p]) == 'undefined' || ce.prototype[p] == Object.prototype[p])
					ce.prototype[p] = ce2.prototype[p];
			for (var p in ce2)
				if (typeof (ce[p]) == 'undefined')
					ce[p] = ce2[p];
			ce.$baseCtor = ce2;

		} else {

			var props = Object.getOwnPropertyNames(ce2.prototype);
			for (var i = 0; i < props.length; i++)
				if (typeof (Object.getOwnPropertyDescriptor(ce.prototype, props[i])) == 'undefined')
					Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i]));

			for (var p in ce2)
				if (typeof (ce[p]) == 'undefined')
					ce[p] = ce2[p];
			ce.$baseCtor = ce2;

		}

	}
};


if (typeof(SharpKitWebApp) == "undefined")
    var SharpKitWebApp = {};
if (typeof(SharpKitWebApp.data) == "undefined")
    SharpKitWebApp.data = {};
SharpKitWebApp.data.response = function (){
    this._clientID = null;
    SharpKitWebApp.data.objectEx.call(this);
};
SharpKitWebApp.data.response.prototype.get_clientID = function (){
    return this._clientID;
};
SharpKitWebApp.data.response.prototype.set_clientID = function (value){
    this._clientID = value;
};
$Inherit(SharpKitWebApp.data.response, SharpKitWebApp.data.objectEx);
SharpKitWebApp.data.connectResponse = function (){
    SharpKitWebApp.data.response.call(this);
};
SharpKitWebApp.data.connectResponse.prototype.get_Type = function (){
    return "connectResponse";
};
$Inherit(SharpKitWebApp.data.connectResponse, SharpKitWebApp.data.response);
SharpKitWebApp.data.messageResponse = function (){
    this._Message = null;
    this._From = null;
    SharpKitWebApp.data.response.call(this);
};
SharpKitWebApp.data.messageResponse.prototype.get_Message = function (){
    return this._Message;
};
SharpKitWebApp.data.messageResponse.prototype.set_Message = function (value){
    this._Message = value;
};
SharpKitWebApp.data.messageResponse.prototype.get_Type = function (){
    return "messageResponse";
};
SharpKitWebApp.data.messageResponse.prototype.get_From = function (){
    return this._From;
};
SharpKitWebApp.data.messageResponse.prototype.set_From = function (value){
    this._From = value;
};
$Inherit(SharpKitWebApp.data.messageResponse, SharpKitWebApp.data.response);
SharpKitWebApp.data.disconnectResponse = function (){
    this._ClientID = null;
    SharpKitWebApp.data.response.call(this);
};
SharpKitWebApp.data.disconnectResponse.prototype.get_ClientID = function (){
    return this._ClientID;
};
SharpKitWebApp.data.disconnectResponse.prototype.set_ClientID = function (value){
    this._ClientID = value;
};
SharpKitWebApp.data.disconnectResponse.prototype.get_Type = function (){
    return "disconnectResponse";
};
$Inherit(SharpKitWebApp.data.disconnectResponse, SharpKitWebApp.data.response);
SharpKitWebApp.data.startGameResponse = function (){
    this.GameId = null;
    this.FirstClientId = null;
    SharpKitWebApp.data.response.call(this);
};
SharpKitWebApp.data.startGameResponse.prototype.get_Type = function (){
    return "startGameResponse";
};
$Inherit(SharpKitWebApp.data.startGameResponse, SharpKitWebApp.data.response);
SharpKitWebApp.data.turnResponse = function (){
    this.GameId = null;
    this.x = 0;
    this.y = 0;
    this.nextClientId = null;
    this.figure = 0;
    this.message = null;
    SharpKitWebApp.data.response.call(this);
};
SharpKitWebApp.data.turnResponse.prototype.get_Type = function (){
    return "turnResponse";
};
$Inherit(SharpKitWebApp.data.turnResponse, SharpKitWebApp.data.response);

