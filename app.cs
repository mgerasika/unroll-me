using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitWebApp.core;

namespace SharpKitWebApp
{
    [JsType(JsMode.Prototype, Filename = "gen/app.js")]
    public class app
    {
        private int _button;
        private object _diffXY;
        private bool _isDesignMode;
        private itemBase _item;

        public void init()
        {
            map.inst().init(4, 4);
            var div = HtmlContext.document.getElementById("res") as HtmlElement;
            Element checkFontSize = HtmlContext.document.getElementById("checkFontSize");
            int emWidth = checkFontSize.offsetWidth;
            int mustBeWidth = (div.offsetWidth/map.inst().getRows());
            string bodyFontSize = HtmlContext.document.body.style.fontSize.replace("px", "");
            int bodyFontSizeInt = JsContext.parseInt(bodyFontSize, 10);
            int newFontSize = (bodyFontSizeInt*mustBeWidth)/emWidth;
            HtmlContext.document.body.style.fontSize = "10px"; //(newFontSize) + "px";

            js.attach(div, "mousedown", js.bind(_mouseDownHandler, this));
            js.attach(div, "touchstart", js.bind(_mouseDownHandler, this));

            js.attach(div, "mousemove", js.bind(_mouseMoveHandler, this));
            js.attach(div, "touchmove", js.bind(_mouseMoveHandler, this));

            js.attach(div, "mouseup", js.bind(_mouseUpHandler, this));
            js.attach(div, "touchend", js.bind(_mouseUpHandler, this));

            js.attach(HtmlContext.document.body, "keydown", js.bind(_keyDownHandler, this));
        }

        public void setIsDesignMode(bool val)
        {
            _isDesignMode = val;
        }

        public bool isDesignMode()
        {
            return _isDesignMode;
        }

        public void moveBallComplete(itemBase it, ball b)
        {
            ESlide inSide = b.getInSide();

            if (inSide == ESlide.center && it.isFinishItem())
            {
                HtmlContext.window.alert("Success level.");
            }
            else
            {
                int x = it.getX();
                int y = it.getY();
                var side = ESlide.none;
                if (inSide == ESlide.top)
                {
                    y--;
                    side = ESlide.bottom;
                }
                else if (inSide == ESlide.bottom)
                {
                    y++;
                    side = ESlide.top;
                }
                else if (inSide == ESlide.left)
                {
                    x--;
                    side = ESlide.right;
                }
                else if (inSide == ESlide.right)
                {
                    x++;
                    side = ESlide.left;
                }

                itemBase newItem = map.inst().getItemByXY(x, y);
                if (newItem != null && newItem.hasSide(side))
                {
                    b.setInSide(side);
                    newItem.moveBall(b, js.bind(delegate { moveBallComplete(newItem, b); }, this));
                }
                else
                {
                    HtmlContext.window.alert("Failed level.");
                }
            }
        }

        public void setItem(itemBase item)
        {
            if (_item != null && (_item != item))
            {
                js.removeClass(_item.getDiv(), "active");
            }
            _item = item;
            if (_item != null)
            {
                js.addClass(_item.getDiv(), "active");
            }
        }

        public itemBase getItem()
        {
            return _item;
        }

        public void _mouseDownHandler(DOMEvent ev)
        {
            var target = js.getSrcElement(ev) as HtmlElement;
            _button = 1;

            if (js.hasClass(target, "item"))
            {
                var xy = js.getEventXY(ev) as JsObject;
                var offset = js.getXY(target) as JsObject;
                xy["x"] = JsContext.parseInt(xy["x"].ToString(), 10) - JsContext.parseInt(offset["x"].ToString(), 10);
                xy["y"] = JsContext.parseInt(xy["y"].ToString(), 10) - JsContext.parseInt(offset["y"].ToString(), 10);
                _diffXY = xy;

                itemBase item = map.inst().getItemById(target.getAttribute("id"));
                setItem(item);
            }
        }

        public void _mouseMoveHandler(DOMEvent ev)
        {
            if ((getItem() != null && (_button == 1)) && (!getItem().isFixed() || isDesignMode()))
            {
                var xy = js.getEventXY(ev) as JsObject;
                var offset = js.getXY(HtmlContext.document.getElementById("res")) as JsObject;
                xy["x"] = (int) xy["x"] - (int) offset["x"];
                xy["y"] = (int) xy["y"] - (int) offset["y"];
                js.assert((int) xy["x"] >= 0);
                js.assert((int) xy["y"] >= 0);

                int x1 = JsContext.parseInt(xy["x"].ToString(), 10);
                int y1 = JsContext.parseInt(xy["y"].ToString(), 10);

                JsNumber x = x1/_item.getDiv().offsetWidth;
                JsNumber y = y1/_item.getDiv().offsetHeight;

                HtmlContext.console.log("x=" + x + " y=" + y);
                if (_item.getX() != x || _item.getY() != y)
                {
                    if (map.inst()._isFree(x, y) && map.inst().canMove(_item, x, y))
                    {
                        getItem().moveTo(x, y);
                    }
                }

                //experement
                /*
            if (this._prevPoint) {
                var div = this.getItem().getDiv();

                var diffX = parseInt((xy.x - this._prevPoint.x) / 1, 10);
                var diffY = parseInt((xy.y - this._prevPoint.y) / 1, 10);
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
                    //if ($map._isFree(x1, y1) || ($map.getItemByXY(x1, y1) == this.getItem())) 
                    {
                        div.style.left = (xy.x - this._diffXY.x) + "px";
                    }
                } 
                else {
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
                        //if ($map._isFree(x2, y2) || ($map.getItemByXY(x2, y2) == this.getItem())) 
                        {
                            div.style.top = (xy.y - this._diffXY.y) + "px";
                        }
                    }
                }
            }
            this._prevPoint = xy;
            */
            }
        }

        public void _mouseUpHandler(DOMEvent ev)
        {
            _button = 0;
            if (_item != null)
            {
                //js.removeClass(this._item.getDiv(),"active");
                //this._item = null;
            }
        }

        public void _keyDownHandler(DOMEvent ev)
        {
            int keyCode = js.getEventKeyCode(ev);
            HtmlContext.console.log(keyCode);

            if (keyCode == 38 && map.inst().canMoveUp(_item))
            {
                _item.moveUp();
            }
            else if (keyCode == 40 && map.inst().canMoveDown(_item))
            {
                _item.moveDown();
            }
            else if (keyCode == 37 && map.inst().canMoveLeft(_item))
            {
                _item.moveLeft();
            }
            else if (keyCode == 39 && map.inst().canMoveRight(_item))
            {
                _item.moveRight();
            }
        }
    };
}