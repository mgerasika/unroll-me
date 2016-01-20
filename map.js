$map = new function() {
    this._items = [];
    this._rows = 0;
    this._cells = 0;
    this._res1;

    this.init = function(rows, cells) {
        this._rows = rows;
        this._cells = cells;
        this._res1 = document.getElementById("res");

        this._res1.style.width = (rows * (10)) + "em";
        this._res1.style.height = (cells * (10)) + "em";
    };

    this.invalidate = function() {
        for (var i = 0, len = this._items.length; i < len; ++i) {
            var item = this._items[i];
            item.invalidate();
        }
    };

    this.load = function(maps) {
        for (var i = 0, len = maps.length; i < len; ++i) {
            var map = maps[i];
            var type = map["_type"];
            var x = parseInt(map["_x"],10);
            var y = parseInt(map["_y"], 10);
            var fixed = js.utils.toBool(map["_fixed"]);
            var item = new window[type](type, x,y,fixed);
            this._items.push(item);
        }

        var div = document.createDocumentFragment();
        for (var i = 0, len = this._items.length; i < len; ++i) {
            var item = this._items[i];
            item.render(div);
        }

        this._res1.appendChild(div);

        this.invalidate();
    };

    this.save = function() {
        var str = js.json.serealize(this._items);
        return str;
    };

    this.addItem = function(item) {
        this._items.push(item);
        item.render(this._res1);
    };

    this.removeItem = function(item) {
        js.utils.remove(this._items, item);
        var div = item.getDiv();
        div.parentNode.removeChild(div);
    };

    this.canMoveUp = function(item) {
        var res = this._isFree(item.getX(), item.getY() - 1);
        return res;
    };

    this.canMoveDown = function(item) {
        var res = this._isFree(item.getX(), item.getY() + 1);
        return res;
    };

    this.canMoveLeft = function(item) {
        var res = this._isFree(item.getX() - 1, item.getY());
        return res;
    };

    this.canMoveRight = function(item) {
        var res = this._isFree(item.getX() + 1, item.getY());
        return res;
    };

    this.canMove = function(item, x, y) {
        var res = false;
        if (this._isFree(x, y)) {
            do {
                if ((Math.abs(item.getX() - x) >= 1) && Math.abs(item.getY() - y) >= 1) {
                    break;
                }
                if (Math.abs(item.getX() - x) >= 2) {
                    js.assert(Math.abs(item.getY() - y) == 0);

                    var flag = false;
                    for (var i = Math.min(item.getX(), x), len = Math.max(item.getX(), x); i < len; ++i) {
                        if (item.getX() == i && item.getY() == y) {
                            continue;
                        }
                        if (!this._isFree(i, y)) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }

                if (Math.abs(item.getY() - y) >= 1) {
                    js.assert(Math.abs(item.getX() - x) == 0);

                    var flag = false;
                    for (var i = Math.min(item.getY(), y), len = Math.max(item.getY(), y); i < len; ++i) {
                        if (item.getX() == x && item.getY() == i) {
                            continue;
                        }
                        if (!this._isFree(x, i)) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
                res = true;
            } while (false);
        }
        return res;
    };

    this.canContinue = function(item) {
        if (item.getType() == "leftToRightItem") {

        }
    };

    this.getItems = function() {
        return this._items;
    };

    this.getItemById = function(id) {
        var res;

        for (var i = 0, len = this._items.length; i < len; ++i) {
            var item = this._items[i];
            if (item.getId() == id) {
                res = item;
                break;
            }
        }

        return res;
    };

    this.getItemByXY = function(x, y) {
        var res;

        for (var i = 0, len = this._items.length; i < len; ++i) {
            var item = this._items[i];
            if (item.getX() == x && item.getY() == y) {
                res = item;
                break;
            }
        }

        return res;
    };

    this._isFree = function(x, y) {
        var res = false;
        if (x >= 0 && x < this._cells && y >= 0 && y < this._rows) {
            var item = this.getItemByXY(x, y);
            res = !item;
        }
        return res;
    };
};