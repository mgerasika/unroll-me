/* Generated by SharpKit 5 v5.4.4 */

if (typeof(SharpKitWebApp) == "undefined")
    var SharpKitWebApp = {};
SharpKitWebApp.point = function (){
    this._x = 0;
    this._y = 0;
    this._inSide = SharpKitWebApp.ESlide.none;
    this.set_inSide(SharpKitWebApp.ESlide.none);
};
SharpKitWebApp.point.prototype.get_x = function (){
    return this._x;
};
SharpKitWebApp.point.prototype.set_x = function (value){
    this._x = value;
};
SharpKitWebApp.point.prototype.get_y = function (){
    return this._y;
};
SharpKitWebApp.point.prototype.set_y = function (value){
    this._y = value;
};
SharpKitWebApp.point.prototype.get_inSide = function (){
    return this._inSide;
};
SharpKitWebApp.point.prototype.set_inSide = function (value){
    this._inSide = value;
};
