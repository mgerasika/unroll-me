using System;
using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitWebApp.data;

namespace SharpKitWebApp.core
{
    [JsType(JsMode.ExtJs, Export = false, Name = "js")]
    public class js
    {
        [JsField(Name = "isIE8")] public static string isIE8;

        [JsMethod(Name = "url")]
        public static string Url(string url)
        {
            return String.Empty;
        }

        [JsMethod(Name = "attach")]
        internal static void attach(HtmlElement el, string p, EventListener listener)
        {
        }

        [JsMethod(Name = "addClass")]
        internal static void addClass(HtmlElement el, string className)
        {
        }

        [JsMethod(Name = "debug")]
        internal static void debugger()
        {
        }

        [JsMethod(Name = "getEventKeyCode")]
        internal static int getEventKeyCode(DOMEvent evt)
        {
            return -1;
        }

        [JsMethod(Name = "getEventButton")]
        internal static int GetEventButton(DOMEvent evt)
        {
            return -1;
        }

        [JsMethod(Name = "generateId")]
        internal static string generateId()
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "assert")]
        internal static void assert(bool p)
        {
            throw new NotImplementedException();
        }

        [JsType(JsMode.ExtJs, Export = false, Name = "js.json")]
        public class json
        {
            [JsMethod(Name = "serealize")]
            internal static string serealize(JsArray<itemBase> jsArray)
            {
                throw new NotImplementedException();
            }
        }

        [JsType(JsMode.ExtJs, Export = false, Name = "js.math")]
        public class math
        {
            [JsMethod(Name = "abs")]
            internal static int abs(int p)
            {
                throw new NotImplementedException();
            }

            [JsMethod(Name = "min")]
            internal static int min(int p, int x)
            {
                throw new NotImplementedException();
            }

            [JsMethod(Name = "max")]
            internal static int max(int p, int x)
            {
                throw new NotImplementedException();
            }
        }

        [JsType(JsMode.ExtJs, Export = false, Name = "js.utils")]
        public class utils
        {
            [JsMethod(Name = "toBool")]
            internal static bool toBool(object p)
            {
                return false;
            }

            [JsMethod(Name = "remove")]
            internal static void remove(JsArray<itemBase> jsArray, itemBase item)
            {
                throw new NotImplementedException();
            }
        }

        [JsMethod(Name = "bind")]
        internal static EventListener bind(EventListener action, object app)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "removeClass")]
        public static void removeClass(HtmlElement getDiv, string active)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "getEventXY")]
        internal static object getEventXY(DOMEvent ev)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "getXY")]
        internal static object getXY(object target)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "getSrcElement")]
        internal static object getSrcElement(DOMEvent ev)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "hasClass")]
        public static bool hasClass(HtmlElement target, string item)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "eval")]
        public static itemBase eval(string str)
        {
            throw new NotImplementedException();
        }

        [JsMethod(Name = "cast")]
        public static T myCast<T>(objectEx objectEx)
        {
            throw new NotImplementedException();
        }
    }
}