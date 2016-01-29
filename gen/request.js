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

if (typeof($CreateException)=='undefined') 
{
    var $CreateException = function(ex, error) 
    {
        if(error==null)
            error = new Error();
        if(ex==null)
            ex = new System.Exception.ctor();       
        error.message = ex.message;
        for (var p in ex)
           error[p] = ex[p];
        return error;
    }
}


if (typeof(SharpKitWebApp) == "undefined")
    var SharpKitWebApp = {};
if (typeof(SharpKitWebApp.data) == "undefined")
    SharpKitWebApp.data = {};
SharpKitWebApp.data.request = function (){
    this.clientId = null;
    SharpKitWebApp.data.objectEx.call(this);
};
$Inherit(SharpKitWebApp.data.request, SharpKitWebApp.data.objectEx);
SharpKitWebApp.data.loginRequest = function (){
    SharpKitWebApp.data.request.call(this);
};
SharpKitWebApp.data.loginRequest.prototype.get_Type = function (){
    return "loginRequest";
};
SharpKitWebApp.data.loginRequest.prototype.send = function (){
    throw $CreateException(new System.NotImplementedException.ctor(), new Error());
};
$Inherit(SharpKitWebApp.data.loginRequest, SharpKitWebApp.data.request);
SharpKitWebApp.data.messageRequest = function (){
    this.Message = null;
    SharpKitWebApp.data.request.call(this);
};
SharpKitWebApp.data.messageRequest.prototype.get_Type = function (){
    return "messageRequest";
};
$Inherit(SharpKitWebApp.data.messageRequest, SharpKitWebApp.data.request);
SharpKitWebApp.data.turnRequest = function (){
    this.x = 0;
    this.y = 0;
    this.figure = 0;
    SharpKitWebApp.data.request.call(this);
};
SharpKitWebApp.data.turnRequest.prototype.get_Type = function (){
    return "turnRequest";
};
$Inherit(SharpKitWebApp.data.turnRequest, SharpKitWebApp.data.request);
