using System;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitWebApp.core;

namespace SharpKitWebApp
{
    [JsType(JsMode.Prototype, Filename = "gen/map.js")]
    public class map
    {
        private readonly JsArray<itemBase> _items = new JsArray<itemBase>();
        private int _cells;
        private HtmlElement _res1;
        private int _rows;
        private static readonly map _inst = new map();

        public static map inst()
        {
            return _inst;
        }

        public void init(int rows, int cells)
        {
            _rows = rows;
            _cells = cells;
            _res1 = HtmlContext.document.getElementById("res") as HtmlElement;

            _res1.style.width = (rows*(10)) + "em";
            _res1.style.height = (cells*(10)) + "em";
        }

        public int getRows()
        {
            return _rows;
        }

        public void invalidate()
        {
            for (int i = 0, len = _items.length; i < len; ++i)
            {
                itemBase item = _items[i];
                item.invalidate();
            }
        }

        public void load(JsArray<JsObject> maps)
        {
            for (int i = 0, len = maps.length; i < len; ++i)
            {
                JsObject map = maps[i];
                object type = map["_type"];
                JsNumber x = JsContext.parseInt(map["_x"].ToString(), 10);
                JsNumber y = JsContext.parseInt(map["_y"].ToString(), 10);
                bool f = js.utils.toBool(map["_fixed"]);

                string str = "new SharpKitWebApp['" + type + "']('" + type + "'," + x + "," + y + "," + f + ")";
                var item = (itemBase) js.eval(str);
                _items.push(item);
            }

            var div = new HtmlDivElement();
            for (int i = 0, len = _items.length; i < len; ++i)
            {
                itemBase item = _items[i];
                item.render(div);
            }
            _res1.appendChild(div);

            invalidate();
        }

        public string save()
        {
            string str = js.json.serealize(_items);
            return str;
        }

        public void addItem(itemBase item)
        {
            _items.push(item);
            item.render(_res1);
        }

        public void removeItem(itemBase item)
        {
            js.utils.remove(_items, item);
            HtmlElement div = item.getDiv();
            div.parentNode.removeChild(div);
        }

        public bool canMoveUp(itemBase item)
        {
            bool res = _isFree(item.getX(), item.getY() - 1);
            return res;
        }

        public bool canMoveDown(itemBase item)
        {
            bool res = _isFree(item.getX(), item.getY() + 1);
            return res;
        }

        public bool canMoveLeft(itemBase item)
        {
            bool res = _isFree(item.getX() - 1, item.getY());
            return res;
        }

        public bool canMoveRight(itemBase item)
        {
            bool res = _isFree(item.getX() + 1, item.getY());
            return res;
        }

        public bool canMove(itemBase item, int x, int y)
        {
            bool res = false;
            if (_isFree(x, y))
            {
                do
                {
                    if ((js.math.abs(item.getX() - x) >= 1) && js.math.abs(item.getY() - y) >= 1)
                    {
                        break;
                    }
                    if (js.math.abs(item.getX() - x) >= 2)
                    {
                        js.assert(js.math.abs(item.getY() - y) == 0);

                        bool flag = false;
                        for (int i = js.math.min(item.getX(), x), len = js.math.max(item.getX(), x); i < len; ++i)
                        {
                            if (item.getX() == i && item.getY() == y)
                            {
                                continue;
                            }
                            if (!_isFree(i, y))
                            {
                                flag = true;
                                break;
                            }
                        }
                        if (flag)
                        {
                            break;
                        }
                    }

                    if (js.math.abs(item.getY() - y) >= 1)
                    {
                        js.assert(js.math.abs(item.getX() - x) == 0);

                        bool flag = false;
                        for (int i = js.math.min(item.getY(), y), len = js.math.max(item.getY(), y); i < len; ++i)
                        {
                            if (item.getX() == x && item.getY() == i)
                            {
                                continue;
                            }
                            if (!_isFree(x, i))
                            {
                                flag = true;
                                break;
                            }
                        }
                        if (flag)
                        {
                            break;
                        }
                    }
                    res = true;
                } while (false);
            }
            return res;
        }

        public bool canContinue(itemBase item)
        {
            bool res = false;
            if (item.getType() == "leftToRightItem")
            {
            }
            return res;
        }

        public JsArray<itemBase> getItems()
        {
            return _items;
        }

        public itemBase getItemById(string id)
        {
            itemBase res = null;

            for (int i = 0, len = _items.length; i < len; ++i)
            {
                itemBase item = _items[i];
                if (item.getId() == id)
                {
                    res = item;
                    break;
                }
            }

            return res;
        }

        public itemBase getItemByXY(int x, int y)
        {
            itemBase res = null;

            for (int i = 0, len = _items.length; i < len; ++i)
            {
                itemBase item = _items[i];
                if (item.getX() == x && item.getY() == y)
                {
                    res = item;
                    break;
                }
            }

            return res;
        }

        public bool _isFree(int x, int y)
        {
            bool res = false;
            if (x >= 0 && x < _cells && y >= 0 && y < _rows)
            {
                itemBase item = getItemByXY(x, y);
                res = (item == null);
            }
            return res;
        }
    };
}