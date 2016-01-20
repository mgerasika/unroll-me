function itemBase(type, x, y, fixed) {
    this._x = x;
    this._y = y;
    this._type = type;
    this._fixed = fixed;
    this.__id = js.generateId();
    this.__div = document.createElement("div");
    this.__div.setAttribute("id", this.__id);
    js.addClass(this.__div, "item");
};

itemBase.xMin = -20;
itemBase.yMin = -20;
itemBase.xMed = 30;
itemBase.yMed = 30;
itemBase.xMax = 80;
itemBase.yMax = 80;

js.extend(itemBase, objectEx);

itemBase.prototype.render = function(par) {
    par.appendChild(this.getDiv());
    this.invalidate();
};

itemBase.prototype.getType = function() {
    return this._type;
};

itemBase.prototype.getDiv = function() {
    return this.__div;
};

itemBase.prototype.isFixed = function() {
    return this._fixed;
};

itemBase.prototype.isStartItem = function() {
    return false;
};

itemBase.prototype.isFinishItem = function() {
    return false;
};

itemBase.prototype.moveBall = function(ball, callback) {
    js.assert(false);
};

itemBase.prototype.hasSide = function(slide) {
    js.assert(false);
};

itemBase.prototype.serealize = function() {
};

itemBase.prototype.getId = function() {
    return this.__id;
};

itemBase.prototype.moveLeft = function() {
    this._x--;
    this.invalidate();
};

itemBase.prototype.moveTo = function(x, y) {
    this._x = x;
    this._y = y;
    this.invalidate();
};

itemBase.prototype.moveRight = function() {
    this._x++;
    this.invalidate();
};

itemBase.prototype.moveUp = function() {
    this._y--;
    this.invalidate();
};

itemBase.prototype.moveDown = function() {
    this._y++;
    this.invalidate();
};

itemBase.prototype.getX = function() {
    return this._x;
};

itemBase.prototype.getY = function() {
    return this._y;
};

itemBase.prototype.invalidate = function() {
    this.getDiv().style.left = ((this._x * (10))) + "em";
    this.getDiv().style.top = ((this._y * (10))) + "em";
};

itemBase.prototype._moveBallInternal = function(ball, points, callback) {
    var self = this;

    var point = points.pop();
    if (point) {
        ball.getDiv().style.left = point.x + "%";
        ball.getDiv().style.top = point.y + "%";
        if (point.inSide) {
            ball.setInSide(point.inSide);
        }
        window.setTimeout(function() {
            self._moveBallInternal(ball, points, callback);
        }, 50);

    } else {
        callback(self, ball);
    }
};

/*
leftToBottomItem
*/
function leftToBottomItem() {
    leftToBottomItem.supper.constructor.apply(this, arguments);
    if (!this.isFixed()) {
        js.addClass(this.getDiv(), "leftToBottomItem");
    } else {
        js.addClass(this.getDiv(), "leftToBottomItemFixed");
    }
};

js.extend(leftToBottomItem, itemBase);

leftToBottomItem.prototype.hasSide = function(slide) {
    var res = (slide == "left") || (slide == "bottom");
    return res;
};

leftToBottomItem.prototype.getSides = function() {
    var res = ["left", "bottom"];
    return res;
};

leftToBottomItem.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    if (ball.getInSide() == "left") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMin + "%";
        ball.getDiv().style.top = itemBase.yMed + "%";
    } else if (ball.getInSide() == "bottom") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMed + "%";
        ball.getDiv().style.top = itemBase.yMax + "%";
    }
};

leftToBottomItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMin, y: itemBase.yMed, inSide: "left" });
    for (var x = itemBase.xMin + 1; x < itemBase.xMed; ++x) {
        points.push({ x: x, y: itemBase.yMed });
    }

    for (var y = itemBase.yMed; y < itemBase.yMax; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMax, inSide: "bottom" });

    var div = this.getDiv();
    if (ball.getInSide() == "left") {
        div.appendChild(ball.getDiv());
        points = points.reverse();
        this._moveBallInternal(ball, points, callback);
    } else if (ball.getInSide() == "bottom") {
        div.appendChild(ball.getDiv());
        this._moveBallInternal(ball, points, callback);
    }
};


/*
leftToRightItem
*/
function leftToRightItem() {
    leftToRightItem.supper.constructor.apply(this, arguments);

    if (!this.isFixed()) {
        js.addClass(this.getDiv(), "leftToRightItem");
    } else {
        js.addClass(this.getDiv(), "leftToRightItemFixed");
    }
};

js.extend(leftToRightItem, itemBase);

leftToRightItem.prototype.hasSide = function(slide) {
    var res = (slide == "left") || (slide == "right");
    return res;
};

leftToRightItem.prototype.getSides = function() {
    var res = ["left", "right"];
    return res;
};

leftToRightItem.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    if (ball.getInSide() == "left") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMin + "%";
        ball.getDiv().style.top = itemBase.yMed + "%";
    } else if (ball.getInSide() == "right") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMax + "%";
        ball.getDiv().style.top = itemBase.yMed + "%";
    }
};

leftToRightItem.prototype.moveBall = function(ball, callback) {
    var self = this;

    var points = [];
    points.push({ x: itemBase.xMin, y: itemBase.yMed, inSide: "left" });
    for (var x = itemBase.xMin + 1; x < itemBase.xMax; ++x) {
        points.push({ x: x, y: itemBase.yMed });
    }
    points.push({ x: itemBase.xMax, y: itemBase.yMed, inSide: "right" });

    var div = this.getDiv();
    if (ball.getInSide() == "left") {
        div.appendChild(ball.getDiv());
        points = points.reverse();
        this._moveBallInternal(ball, points, callback);
    } else if (ball.getInSide() == "right") {
        div.appendChild(ball.getDiv());
        this._moveBallInternal(ball, points, callback);
    }
};

/*
rightToBottomItem
*/
function rightToBottomItem() {
    rightToBottomItem.supper.constructor.apply(this, arguments);

    if (!this.isFixed()) {
        js.addClass(this.getDiv(), "rightToBottomItem");
    } else {
        js.addClass(this.getDiv(), "rightToBottomItemFixed");
    }
};

js.extend(rightToBottomItem, itemBase);

rightToBottomItem.prototype.hasSide = function(slide) {
    var res = (slide == "right") || (slide == "bottom");
    return res;
};

rightToBottomItem.prototype.getSides = function() {
    var res = ["right", "bottom"];
    return res;
};

rightToBottomItem.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    if (ball.getInSide() == "right") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMax + "%";
        ball.getDiv().style.top = itemBase.yMed + "%";

    } else if (ball.getInSide() == "bottom") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMed + "%";
        ball.getDiv().style.top = itemBase.yMax + "%";
    }
};

rightToBottomItem.prototype.moveBall = function(ball, callback) {
    var self = this;

    var points = [];
    points.push({ x: itemBase.xMax, y: itemBase.yMed, inSide: "right" });
    for (var x = itemBase.xMax - 1; x > itemBase.xMed; --x) {
        points.push({ x: x, y: itemBase.yMed });
    }

    for (var y = itemBase.yMed; y < itemBase.yMax; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMax, inSide: "bottom" });

    var div = this.getDiv();
    if (ball.getInSide() == "right") {
        div.appendChild(ball.getDiv());
        points = points.reverse();
        this._moveBallInternal(ball, points, callback);
    } else if (ball.getInSide() == "bottom") {
        div.appendChild(ball.getDiv());
        this._moveBallInternal(ball, points, callback);
    }
};

/*
topToBottomItem
*/
function topToBottomItem() {
    topToBottomItem.supper.constructor.apply(this, arguments);

    if (!this.isFixed()) {
        js.addClass(this.getDiv(), "topToBottomItem");
    } else {
        js.addClass(this.getDiv(), "topToBottomItemFixed");
    }
};

js.extend(topToBottomItem, itemBase);

topToBottomItem.prototype.hasSide = function(slide) {
    var res = (slide == "top") || (slide == "bottom");
    return res;
};

topToBottomItem.prototype.getSides = function() {
    var res = ["top", "bottom"];
    return res;
};

topToBottomItem.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    if (ball.getInSide() == "top") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMed + "%";
        ball.getDiv().style.top = itemBase.yMin + "%";
    } else if (ball.getInSide() == "bottom") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMed + "%";
        ball.getDiv().style.top = itemBase.yMax + "%";
    }
};

topToBottomItem.prototype.moveBall = function(ball, callback) {
    var self = this;

    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMin, inSide: "top" });

    for (var y = itemBase.yMin + 1; y < itemBase.yMax; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMax, inSide: "bottom" });

    var div = this.getDiv();
    if (ball.getInSide() == "top") {
        div.appendChild(ball.getDiv());
        points = points.reverse();
        this._moveBallInternal(ball, points, callback);
    } else if (ball.getInSide() == "bottom") {
        div.appendChild(ball.getDiv());
        this._moveBallInternal(ball, points, callback);
    }
};

/*
topToLeftItem
*/
function topToLeftItem() {
    topToLeftItem.supper.constructor.apply(this, arguments);

    if (!this.isFixed()) {
        js.addClass(this.getDiv(), "topToLeftItem");
    } else {
        js.addClass(this.getDiv(), "topToLeftItemFixed");
    }
};

js.extend(topToLeftItem, itemBase);

topToLeftItem.prototype.hasSide = function(slide) {
    var res = (slide == "top") || (slide == "left");
    return res;
};

topToLeftItem.prototype.getSides = function() {
    var res = ["top", "left"];
    return res;
};

topToLeftItem.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    if (ball.getInSide() == "top") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMed + "%";
        ball.getDiv().style.top = itemBase.yMin + "%";

    } else if (ball.getInSide() == "left") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMin + "%";
        ball.getDiv().style.top = itemBase.yMed + "%";
    }
};

topToLeftItem.prototype.moveBall = function(ball, callback) {
    var self = this;

    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMin, inSide: "top" });

    for (var y = itemBase.yMin + 1; y < itemBase.yMed; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }

    for (var x = itemBase.xMed; x > itemBase.xMin; --x) {
        points.push({ x: x, y: itemBase.yMed });
    }


    points.push({ x: itemBase.xMin, y: itemBase.yMed, inSide: "left" });
    var div = this.getDiv();
    if (ball.getInSide() == "top") {
        div.appendChild(ball.getDiv());
        points = points.reverse();
        this._moveBallInternal(ball, points, callback);
    } else if (ball.getInSide() == "left") {
        div.appendChild(ball.getDiv());
        this._moveBallInternal(ball, points, callback);
    } else {
        js.assert(false);
    }
};

/*
topToRightItem
*/
function topToRightItem() {
    topToRightItem.supper.constructor.apply(this, arguments);
    if (!this.isFixed()) {
        js.addClass(this.getDiv(), "topToRightItem");
    } else {
        js.addClass(this.getDiv(), "topToRightItemFixed");
    }
};

js.extend(topToRightItem, itemBase);

topToRightItem.prototype.hasSide = function(slide) {
    var res = (slide == "top") || (slide == "right");
    return res;
};

topToRightItem.prototype.getSides = function() {
    var res = ["top", "right"];
    return res;
};

topToRightItem.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    if (ball.getInSide() == "top") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMed + "%";
        ball.getDiv().style.top = itemBase.yMin + "%";

    } else if (ball.getInSide() == "right") {
        div.appendChild(ball.getDiv());
        ball.getDiv().style.left = itemBase.xMax + "%";
        ball.getDiv().style.top = itemBase.yMed + "%";
    }
};

topToRightItem.prototype.moveBall = function(ball, callback) {
    var self = this;

    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMin, inSide: "top" });

    for (var y = itemBase.yMin + 1; y < itemBase.yMed; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }

    for (var x = itemBase.xMed; x < itemBase.xMax; ++x) {
        points.push({ x: x, y: itemBase.yMed });
    }

    points.push({ x: itemBase.xMax, y: itemBase.yMed, inSide: "right" });

    var div = this.getDiv();
    if (ball.getInSide() == "top") {
        div.appendChild(ball.getDiv());
        points = points.reverse();
        this._moveBallInternal(ball, points, callback);
    } else if (ball.getInSide() == "right") {
        div.appendChild(ball.getDiv());
        this._moveBallInternal(ball, points, callback);
    } else {
        js.assert(false);
    }
};

/*
startItemBase
*/
function startItemBase() {
    startItemBase.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "startItem");
};

js.extend(startItemBase, itemBase);

startItemBase.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    ball.getDiv().style.left = itemBase.xMed + "%";
    ball.getDiv().style.top = itemBase.yMed + "%";
};

startItemBase.prototype.isStartItem = function() {
    return true;
};

/*
startLeftItem
*/
function startLeftItem() {
    startLeftItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "startLeftItem");
};

js.extend(startLeftItem, startItemBase);

startLeftItem.prototype.hasSide = function(slide) {
    var res = (slide == "left");
    return res;
};

startLeftItem.prototype.getSides = function() {
    var res = ["left"];
    return res;
};

startLeftItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var x = itemBase.xMed - 1; x > itemBase.xMin; x--) {
        points.push({ x: x, y: itemBase.yMed });
    }
    points.push({ x: itemBase.xMin, y: itemBase.yMed, inSide: "left" });
    points = points.reverse();

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};

/*
startRightItem
*/
function startRightItem() {
    startRightItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "startRightItem");
};

js.extend(startRightItem, startItemBase);

startRightItem.prototype.hasSide = function(slide) {
    var res = (slide == "right");
    return res;
};

startRightItem.prototype.getSides = function() {
    var res = ["right"];
    return res;
};

startRightItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var x = itemBase.xMed+1; x < itemBase.xMax; x++) {
        points.push({ x: x, y: itemBase.yMed });
    }
    points.push({ x: itemBase.xMax, y: itemBase.yMed, inSide: "right" });
    points = points.reverse();

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};

/*
startTopItem
*/
function startTopItem() {
    startTopItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "startTopItem");
};

js.extend(startTopItem, startItemBase);

startTopItem.prototype.hasSide = function(slide) {
    var res = (slide == "top");
    return res;
};

startTopItem.prototype.getSides = function() {
    var res = ["top"];
    return res;
};

startTopItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var y = itemBase.yMed; y > itemBase.yMin; --y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMin, inSide: "top" });
    points = points.reverse();

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};

/*
startBottomItem
*/
function startBottomItem() {
    startBottomItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "startBottomItem");
};

js.extend(startBottomItem, startItemBase);

startBottomItem.prototype.hasSide = function(slide) {
    var res = (slide == "bottom");
    return res;
};

startBottomItem.prototype.getSides = function() {
    var res = ["bottom"];
    return res;
};

startBottomItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var y = itemBase.yMed; y < itemBase.yMax; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMax, inSide: "bottom" });
    points = points.reverse();

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};


/*
finishItemBase
*/
function finishItemBase() {
    finishItemBase.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "finishItem");
};

js.extend(finishItemBase, itemBase);

finishItemBase.prototype.showBall = function(ball, callback) {
    var self = this;

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
};

finishItemBase.prototype.isFinishItem = function() {
    return true;
};

/*
finishLeftItem
*/
function finishLeftItem() {
    finishLeftItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "finishLeftItem");
};

js.extend(finishLeftItem, finishItemBase);

finishLeftItem.prototype.hasSide = function(slide) {
    var res = (slide == "left");
    return res;
};

finishLeftItem.prototype.getSides = function() {
    var res = ["left"];
    return res;
};

finishLeftItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var x = itemBase.xMed; x > itemBase.xMin; x--) {
        points.push({ x: x, y: itemBase.yMed });
    }
    points.push({ x: itemBase.xMin, y: itemBase.yMed, inSide: "left" });

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};

/*
finishRightItem
*/
function finishRightItem() {
    finishRightItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "finishRightItem");
};

js.extend(finishRightItem, finishItemBase);

finishRightItem.prototype.hasSide = function(slide) {
    var res = (slide == "right");
    return res;
};

finishRightItem.prototype.getSides = function() {
    var res = ["right"];
    return res;
};

finishRightItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var x = itemBase.xMed; x < itemBase.xMax; x++) {
        points.push({ x: x, y: itemBase.yMed });
    }
    points.push({ x: itemBase.xMax, y: itemBase.yMed, inSide: "right" });

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};

/*
finishTopItem
*/
function finishTopItem() {
    finishTopItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "finishTopItem");
};

js.extend(finishTopItem, finishItemBase);

finishTopItem.prototype.hasSide = function(slide) {
    var res = (slide == "top");
    return res;
};

finishTopItem.prototype.getSides = function() {
    var res = ["top"];
    return res;
};

finishTopItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var y = itemBase.yMed; y > itemBase.yMin; --y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMin, inSide: "top" });

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};

/*
finishBottomItem
*/
function finishBottomItem() {
    finishBottomItem.supper.constructor.apply(this, arguments);
    js.addClass(this.getDiv(), "finishBottomItem");
};

js.extend(finishBottomItem, finishItemBase);

finishBottomItem.prototype.hasSide = function(slide) {
    var res = (slide == "bottom");
    return res;
};

finishBottomItem.prototype.getSides = function() {
    var res = ["bottom"];
    return res;
};

finishBottomItem.prototype.moveBall = function(ball, callback) {
    var self = this;
    var points = [];
    points.push({ x: itemBase.xMed, y: itemBase.yMed, inSide: "center" });
    for (var y = itemBase.yMed; y < itemBase.yMax; ++y) {
        points.push({ x: itemBase.xMed, y: y });
    }
    points.push({ x: itemBase.xMed, y: itemBase.yMax, inSide: "bottom" });

    var div = this.getDiv();
    div.appendChild(ball.getDiv());
    this._moveBallInternal(ball, points, callback);
};