function ball() {
    this._inSide = "";
    this.__div = document.createElement("div");
    js.addClass(this.__div, "ball");
};

js.extend(ball, objectEx);

ball.prototype.getInSide = function(){
    return this._inSide;
};

ball.prototype.getDiv = function(){
    return this.__div;
};

ball.prototype.setInSide = function(v){
    this._inSide = v;
};