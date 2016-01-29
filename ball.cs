using SharpKit.Html;
using SharpKit.JavaScript;
using SharpKitWebApp.core;

namespace SharpKitWebApp
{
    [JsType(JsMode.Prototype, Filename = "gen/ball.js")]
    public class ball
    {
        private readonly HtmlElement __div;
        private ESlide _inSide;

        public ball()
        {
            _inSide = ESlide.none;
            __div = HtmlContext.document.createElement("div") as HtmlElement;
            js.addClass(__div, "ball");
        }


        public ESlide getInSide()
        {
            return _inSide;
        }

        public void setInSide(ESlide str)
        {
            _inSide = str;
        }

        public HtmlElement getDiv()
        {
            return __div;
        }
    }
}