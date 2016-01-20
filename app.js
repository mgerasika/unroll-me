$app = new function() {
    this._item;
    this._isDesignMode = false;

    this.init = function() {
        $map.init(4, 4);
        var div = document.getElementById("res");
        js.attach(div, "mousedown", js.bind(this._mouseDownHandler, this));
        js.attach(div, "touchstart", js.bind(this._mouseDownHandler, this));

        js.attach(div, "mousemove", js.bind(this._mouseMoveHandler, this));
        js.attach(div, "touchmove", js.bind(this._mouseMoveHandler, this));

        js.attach(div, "mouseup", js.bind(this._mouseUpHandler, this));
        js.attach(div, "touchend", js.bind(this._mouseUpHandler, this));

        js.attach(document.body, "keydown", js.bind(this._keyDownHandler, this));
    };

    this.setIsDesignMode = function(val) {
        this._isDesignMode = val;
    };

    this.isDesignMode = function() {
        return this._isDesignMode;
    };

    this.moveBallComplete = function(it, b) {
        var inSide = b.getInSide();

        if (inSide == "center" && it.isFinishItem()) {
            alert("Success level.");
        } 
        else {
            var x = it.getX();
            var y = it.getY();
            var side = "";
            if (inSide == "top") {
                y--;
                side = "bottom";
            } else if (inSide == "bottom") {
                y++;
                side = "top";
            } else if (inSide == "left") {
                x--;
                side = "right";
            } else if (inSide == "right") {
                x++;
                side = "left";
            }

            var newItem = $map.getItemByXY(x, y);
            if (newItem && newItem.hasSide(side)) {
                b.setInSide(side);
                newItem.moveBall(b, js.bind(this.moveBallComplete, this));
            } else {
                alert("Failed level.");
            }
        }
    };

    this.setItem = function(item) {
        if (this._item && (this._item != item)) {
            js.removeClass(this._item.getDiv(), "active");
        }
        this._item = item;
        if (this._item) {
            js.addClass(this._item.getDiv(), "active");
        }
    };

    this.getItem = function() {
        return this._item;
    };

    this._mouseDownHandler = function(ev) {
        var target = js.getSrcElement(ev);
        this._button = 1;

        if (js.hasClass(target, "item")) {
            var xy = js.getEventXY(ev);
            var offset = js.getXY(target);
            xy.x = xy.x - offset.x;
            xy.y = xy.y - offset.y;
            this._diffXY = xy;

            var item = $map.getItemById(target.getAttribute("id"));
            this.setItem(item);
        }
    };

    this._mouseMoveHandler = function(ev) {
        if ((this.getItem() && (this._button == 1)) && (!this.getItem().isFixed() || this.isDesignMode() )) {
            var xy = js.getEventXY(ev);
            var offset = js.getXY(js.getById("res"));
            xy.x = xy.x - offset.x;
            xy.y = xy.y - offset.y;
            js.assert(xy.x >= 0);
            js.assert(xy.y >= 0);

            var x = parseInt(xy.x / (this._item.getDiv().offsetWidth), 10);
            var y = parseInt(xy.y / (this._item.getDiv().offsetHeight), 10);

            console.log("x=" + x + " y=" + y);
            if (this._item.getX() != x || this._item.getY() != y) {
                if ($map._isFree(x, y) && $map.canMove(this._item, x, y)) {
                    this.getItem().moveTo(x, y);
                }
            }

            //experement
            /*
            if (this._prevPoint) {
                var div = this.getItem().getDiv();

                var diffX = parseInt((xy.x - this._prevPoint.x) / 2, 10);
                var diffY = parseInt((xy.y - this._prevPoint.y) / 2, 10);
                var x1 = this.getItem().getX();
                var y1 = this.getItem().getY();
                if (diffX > 0) {
                    x1++;
                    console.log("moveRight");
                } else if (diffX < 0) {
                    x1--;
                    console.log("moveLeft");
                }

                if (diffX != 0) {
                    if ($map._isFree(x1, y1) || ($map.getItemByXY(x1, y1) == this.getItem())) {
                        div.style.left = (xy.x - this._diffXY.x) + "px";
                    }
                }

                var x2 = x;
                var y2 = y;
                if (diffY > 0) {
                    y2++;
                    console.log("moveDown");
                } else if (diffY < 0) {
                    y2--;
                    console.log("moveUp");
                }
                if (diffY != 0) {
                    if ($map._isFree(x2, y2) || ($map.getItemByXY(x2, y2) == this.getItem())) {
                        div.style.top = (xy.y - this._diffXY.y) + "px";
                    }
                }
            }*/
            this._prevPoint = xy;
        }
    };

    this._mouseUpHandler = function(ev) {
        this._button = 0;
        if (this._item) {
            //js.removeClass(this._item.getDiv(),"active");
            //this._item = null;
        }
    };

    this._keyDownHandler = function(ev) {
        var keyCode = ev.keyCode | ev.with;
        console.log(keyCode);

        if (keyCode == "38" && $map.canMoveUp(this._item)) {
            this._item.moveUp();
        } else if (keyCode == "40" && $map.canMoveDown(this._item)) {
            this._item.moveDown();
        } else if (keyCode == "37" && $map.canMoveLeft(this._item)) {
            this._item.moveLeft();
        } else if (keyCode == "39" && $map.canMoveRight(this._item)) {
            this._item.moveRight();
        }
    };
};