using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitWebApp;
using SharpKitWebApp.core;

namespace SharpKitWebApp
{
    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public abstract class itemBase
    {
        public static int xMin = -20;
        public static int yMin = -20;
        public static int xMed = 30;
        public static int yMed = 30;
        public static int xMax = 80;
        public static int yMax = 80;
        private readonly HtmlDivElement __div;
        private readonly bool _fixed;
        private readonly string _type;
        public string __id;
        private int _x;
        private int _y;

        public itemBase(string type, int x, int y, bool f)
        {
            _x = x;
            _y = y;
            _type = type;
            _fixed = f;
            __id = js.generateId();
            __div = new HtmlDivElement();
            __div.setAttribute("id", __id);
            js.addClass(this.__div, "item");
        }

        [JsMethod]
        public virtual void render(HtmlElement parent)
        {
            parent.appendChild(__div);
            invalidate();
        }


        [JsMethod]
        internal void moveLeft()
        {
            _x--;

            invalidate();
        }

        [JsMethod]
        internal void moveRight()
        {
            _x++;

            invalidate();
        }

        [JsMethod]
        internal void moveUp()
        {
            _y--;

            invalidate();
        }

        [JsMethod]
        internal void moveDown()
        {
            _y++;

            invalidate();
        }

        [JsMethod]
        internal string getType()
        {
            return _type;
        }

        [JsMethod]
        internal HtmlElement getDiv()
        {
            return __div;
        }

        [JsMethod]
        public bool isFixed()
        {
            return _fixed;
        }

        [JsMethod]
        public bool isStartItem()
        {
            return false;
        }

        [JsMethod]
        public bool isFinishItem()
        {
            return false;
        }

        [JsMethod]
        public void moveBall(object ball, object callback)
        {
            js.assert(false);
        }

        [JsMethod]
        public bool hasSide(object slide)
        {
            js.assert(false);
            return false;
        }

        [JsMethod]
        public void serealize()
        {
        }

        [JsMethod]
        public string getId()
        {
            return __id;
        }

        [JsMethod]
        public void moveTo(int x, int y)
        {
            _x = x;
            _y = y;
            invalidate();
        }

        [JsMethod]
        public int getX()
        {
            return _x;
        }

        [JsMethod]
        public int getY()
        {
            return _y;
        }

        [JsMethod]
        public void invalidate()
        {
            getDiv().style.left = ((_x*(10))) + "em";
            getDiv().style.top = ((_y*(10))) + "em";
        }

        [JsMethod]
        public void _moveBallInternal(ball b, JsArray<point> points, JsAction callback)
        {
            itemBase self = this;

            point point = points.pop();
            if (point != null)
            {
                b.getDiv().style.left = point.x + "%";
                b.getDiv().style.top = point.y + "%";
                if (point.inSide != ESlide.none)
                {
                    b.setInSide(point.inSide);
                }
                HtmlContext.window.setTimeout(delegate { self._moveBallInternal(b, points, callback); }, 50);
            }
            else
            {
                callback();
            }
        }

        public abstract JsArray<ESlide> getSlides();

        public virtual void showBall(ball ball, JsAction callback)
        {
            
        }
    }


    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class leftToBottomItem : itemBase
    {
        public leftToBottomItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            if (!isFixed())
            {
                js.addClass(getDiv(), "leftToBottomItem");
            }
            else
            {
                js.addClass(getDiv(), "leftToBottomItemFixed");
            }
        }

        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.left) || (slide == ESlide.bottom);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.left,
                ESlide.bottom
            }
                ;
            return res;
        }

        public override void showBall(ball ball, JsAction callback)
        {
            leftToBottomItem self = this;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.left)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMin + "%";
                ball.getDiv().style.top = yMed + "%";
            }
            else if (ball.getInSide() == ESlide.bottom)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMed + "%";
                ball.getDiv().style.top = yMax + "%";
            }
        }

        public void moveBall(ball ball, JsAction callback)
        {
            leftToBottomItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMin, y = yMed, inSide = ESlide.left})
                ;
            for (int x = xMin + 1; x < xMed; ++x)
            {
                points.push(new point {x = x, y = yMed});
            }

            for (int y = yMed; y < yMax; ++y)
            {
                points.push(new point {x = xMed, y = y})
                    ;
            }
            points.push(new point {x = xMed, y = yMax, inSide = ESlide.bottom})
                ;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.left)
            {
                div.appendChild(ball.getDiv());
                points = points.reverse();
                _moveBallInternal(ball, points, callback);
            }
            else if (ball.getInSide() == ESlide.bottom)
            {
                div.appendChild(ball.getDiv());
                _moveBallInternal(ball, points, callback);
            }
        }
    }


    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class leftToRightItem : itemBase
    {
        public leftToRightItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            if (!isFixed())
            {
                js.addClass(getDiv(), "leftToRightItem");
            }
            else
            {
                js.addClass(getDiv(), "leftToRightItemFixed");
            }
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.left) || (slide == ESlide.right);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.left,
                ESlide.right
            }
                ;
            return res;
        }

        public override void showBall(ball ball, JsAction callback)
        {
            leftToRightItem self = this;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.left)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMin + "%";
                ball.getDiv().style.top = yMed + "%";
            }
            else if (ball.getInSide() == ESlide.right)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMax + "%";
                ball.getDiv().style.top = yMed + "%";
            }
        }

        public void moveBall(ball ball, JsAction callback)
        {
            leftToRightItem self = this;

            var points = new JsArray<point>();
            points.push(new point {x = xMin, y = yMed, inSide = ESlide.left})
                ;
            for (int x = xMin + 1; x < xMax; ++x)
            {
                points.push(new point {x = x, y = yMed})
                    ;
            }
            points.push(new point {x = xMax, y = yMed, inSide = ESlide.right})
                ;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.left)
            {
                div.appendChild(ball.getDiv());
                points = points.reverse();
                _moveBallInternal(ball, points, callback);
            }
            else if (ball.getInSide() == ESlide.right)
            {
                div.appendChild(ball.getDiv());
                _moveBallInternal(ball, points, callback);
            }
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class rightToBottomItem : itemBase
    {
        public rightToBottomItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            if (!isFixed())
            {
                js.addClass(getDiv(), "rightToBottomItem");
            }
            else
            {
                js.addClass(getDiv(), "rightToBottomItemFixed");
            }
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.right) || (slide == ESlide.bottom);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.right,
                ESlide.bottom
            }
                ;
            return res;
        }

        public override void showBall(ball ball, JsAction callback)
        {
            rightToBottomItem self = this;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.right)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMax + "%";
                ball.getDiv().style.top = yMed + "%";
            }
            else if (ball.getInSide() == ESlide.bottom)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMed + "%";
                ball.getDiv().style.top = yMax + "%";
            }
        }

        public void moveBall(ball ball, JsAction callback)
        {
            rightToBottomItem self = this;

            var points = new JsArray<point>();
            points.push(new point {x = xMax, y = yMed, inSide = ESlide.right});
            for (int x = xMax - 1; x > xMed; --x)
            {
                points.push(new point {x = x, y = yMed});
            }

            for (int y = yMed; y < yMax; ++y)
            {
                points.push(new point {x = xMed, y = y});
            }
            points.push(new point {x = xMed, y = yMax, inSide = ESlide.bottom});

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.right)
            {
                div.appendChild(ball.getDiv());
                points = points.reverse();
                _moveBallInternal(ball, points, callback);
            }
            else if (ball.getInSide() == ESlide.bottom)
            {
                div.appendChild(ball.getDiv());
                _moveBallInternal(ball, points, callback);
            }
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class topToBottomItem : itemBase
    {
        public topToBottomItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            if (!isFixed())
            {
                js.addClass(getDiv(), "topToBottomItem");
            }
            else
            {
                js.addClass(getDiv(), "topToBottomItemFixed");
            }
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.top) || (slide == ESlide.bottom);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.top,
                ESlide.bottom
            }
                ;
            return res;
        }

        public override void showBall(ball ball, JsAction callback)
        {
            topToBottomItem self = this;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.top)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMed + "%";
                ball.getDiv().style.top = yMin + "%";
            }
            else if (ball.getInSide() == ESlide.bottom)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMed + "%";
                ball.getDiv().style.top = yMax + "%";
            }
        }

        public void moveBall(ball ball, JsAction callback)
        {
            topToBottomItem self = this;

            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMin, inSide = ESlide.top});

            for (int y = yMin + 1; y < yMax; ++y)
            {
                points.push(new point {x = xMed, y = y});
            }
            points.push(new point {x = xMed, y = yMax, inSide = ESlide.bottom});

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.top)
            {
                div.appendChild(ball.getDiv());
                points = points.reverse();
                _moveBallInternal(ball, points, callback);
            }
            else if (ball.getInSide() == ESlide.bottom)
            {
                div.appendChild(ball.getDiv());
                _moveBallInternal(ball, points, callback);
            }
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class topToLeftItem : itemBase
    {
        public topToLeftItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            if (!isFixed())
            {
                js.addClass(getDiv(), "topToLeftItem");
            }
            else
            {
                js.addClass(getDiv(), "topToLeftItemFixed");
            }
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.top) || (slide == ESlide.left);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.top,
                ESlide.left
            }
                ;
            return res;
        }

        public override void showBall(ball ball, JsAction callback)
        {
            topToLeftItem self = this;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.top)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMed + "%";
                ball.getDiv().style.top = yMin + "%";
            }
            else if (ball.getInSide() == ESlide.left)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMin + "%";
                ball.getDiv().style.top = yMed + "%";
            }
        }

        public void moveBall(ball ball, JsAction callback)
        {
            topToLeftItem self = this;

            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMin, inSide = ESlide.top});

            for (int y = yMin + 1; y < yMed; ++y)
            {
                points.push(new point {x = xMed, y = y});
            }

            for (int x = xMed; x > xMin; --x)
            {
                points.push(new point {x = x, y = yMed});
            }


            points.push(new point {x = xMin, y = yMed, inSide = ESlide.left});
            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.top)
            {
                div.appendChild(ball.getDiv());
                points = points.reverse();
                _moveBallInternal(ball, points, callback);
            }
            else if (ball.getInSide() == ESlide.left)
            {
                div.appendChild(ball.getDiv());
                _moveBallInternal(ball, points, callback);
            }
            else
            {
                js.assert(false);
            }
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class topToRightItem : itemBase
    {
        public topToRightItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            if (!isFixed())
            {
                js.addClass(getDiv(), "topToRightItem");
            }
            else
            {
                js.addClass(getDiv(), "topToRightItemFixed");
            }
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.top) || (slide == ESlide.right);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.top,
                ESlide.right
            }
                ;
            return res;
        }

        public override void showBall(ball ball, JsAction callback)
        {
            topToRightItem self = this;

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.top)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMed + "%";
                ball.getDiv().style.top = yMin + "%";
            }
            else if (ball.getInSide() == ESlide.right)
            {
                div.appendChild(ball.getDiv());
                ball.getDiv().style.left = xMax + "%";
                ball.getDiv().style.top = yMed + "%";
            }
        }

        public void moveBall(ball ball, JsAction callback)
        {
            topToRightItem self = this;

            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMin, inSide = ESlide.top});

            for (int y = yMin + 1; y < yMed; ++y)
            {
                points.push(new point {x = xMed, y = y});
            }

            for (int x = xMed; x < xMax; ++x)
            {
                points.push(new point {x = x, y = yMed});
            }

            points.push(new point {x = xMax, y = yMed, inSide = ESlide.right});

            HtmlElement div = getDiv();
            if (ball.getInSide() == ESlide.top)
            {
                div.appendChild(ball.getDiv());
                points = points.reverse();
                _moveBallInternal(ball, points, callback);
            }
            else if (ball.getInSide() == ESlide.right)
            {
                div.appendChild(ball.getDiv());
                _moveBallInternal(ball, points, callback);
            }
            else
            {
                js.assert(false);
            }
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public abstract class startItemBase : itemBase
    {
        public startItemBase(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "startItem");
        }


        public override void showBall(ball ball, JsAction callback)
        {
            startItemBase self = this;

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            ball.getDiv().style.left = xMed + "%";
            ball.getDiv().style.top = yMed + "%";
        }

        public bool isStartItem()
        {
            return true;
        }



    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class startLeftItem : startItemBase
    {
        public startLeftItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "startLeftItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.left);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.left
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            startLeftItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int x = xMed - 1; x > xMin; x--)
            {
                points.push(new point {x = x, y = yMed});
            }
            points.push(new point {x = xMin, y = yMed, inSide = ESlide.left});
            points = points.reverse();

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class startRightItem : startItemBase
    {
        public startRightItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "startRightItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.right);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.right
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            startRightItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int x = xMed + 1; x < xMax; x++)
            {
                points.push(new point {x = x, y = yMed});
            }
            points.push(new point {x = xMax, y = yMed, inSide = ESlide.right});
            points = points.reverse();

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class startTopItem : startItemBase
    {
        public startTopItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "startTopItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.top);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.top
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            startTopItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int y = yMed; y > yMin; --y)
            {
                points.push(new point {x = xMed, y = y});
            }
            points.push(new point {x = xMed, y = yMin, inSide = ESlide.top});
            points = points.reverse();

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class startBottomItem : startItemBase
    {
        public startBottomItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "startBottomItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.bottom);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.bottom
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            startBottomItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int y = yMed; y < yMax; ++y)
            {
                points.push(new point {x = xMed, y = y});
            }
            points.push(new point {x = xMed, y = yMax, inSide = ESlide.bottom});
            points = points.reverse();

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public abstract class finishItemBase : itemBase
    {
        public finishItemBase(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "finishItem");
        }


        public override void showBall(ball ball, JsAction callback)
        {
            finishItemBase self = this;

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
        }

        public bool isFinishItem()
        {
            return true;
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class finishLeftItem : finishItemBase
    {
        public finishLeftItem(string type, int x, int y, bool f)
            : base(type, x, y, f)
        {
            js.addClass(getDiv(), "finishLeftItem");
        }

        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.left);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.left
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            finishLeftItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int x = xMed; x > xMin; x--)
            {
                points.push(new point {x = x, y = yMed});
            }
            points.push(new point {x = xMin, y = yMed, inSide = ESlide.left});

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class finishRightItem : finishItemBase
    {
        public finishRightItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            js.addClass(getDiv(), "finishRightItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.right);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.right
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            finishRightItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int x = xMed; x < xMax; x++)
            {
                points.push(new point {x = x, y = yMed});
            }
            points.push(new point {x = xMax, y = yMed, inSide = ESlide.right});

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class finishTopItem : finishItemBase
    {
        public finishTopItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            js.addClass(getDiv(), "finishTopItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.top);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.top
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            finishTopItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int y = yMed; y > yMin; --y)
            {
                points.push(new point {x = xMed, y = y});
            }
            points.push(new point {x = xMed, y = yMin, inSide = ESlide.top});

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }

    [JsType(JsMode.Prototype, Filename = "gen/item.js")]
    public class finishBottomItem : finishItemBase
    {
        public finishBottomItem(string type, int x, int y, bool f) : base(type, x, y, f)
        {
            js.addClass(getDiv(), "finishBottomItem");
        }


        public bool hasSide(ESlide slide)
        {
            bool res = (slide == ESlide.bottom);
            return res;
        }

        public override JsArray<ESlide> getSlides()
        {
            var res = new JsArray<ESlide>
            {
                ESlide.bottom
            }
                ;
            return res;
        }

        public void moveBall(ball ball, JsAction callback)
        {
            finishBottomItem self = this;
            var points = new JsArray<point>();
            points.push(new point {x = xMed, y = yMed, inSide = ESlide.center});
            for (int y = yMed; y < yMax; ++y)
            {
                points.push(new point {x = xMed, y = y});
            }
            points.push(new point {x = xMed, y = yMax, inSide = ESlide.bottom});

            HtmlElement div = getDiv();
            div.appendChild(ball.getDiv());
            _moveBallInternal(ball, points, callback);
        }
    }
}